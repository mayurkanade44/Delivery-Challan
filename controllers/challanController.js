import Challan from "../models/challanModel.js";
import Admin from "../models/adminModel.js";
import moment from "moment";
import { createReport } from "docx-templates";
import fs from "fs";
import QRCode from "qrcode";
import { sendEmail, uploadFile } from "../utils/helperFunctions.js";

export const createChallan = async (req, res) => {
  try {
    const date = moment().format("DD#MM#YY");
    const admin = await Admin.findById("653256866b502b375e370966");
    req.body.number = `SSS - #${admin.challanCounter}#`;
    req.body.update = [
      { status: "Created", user: req.user.name, date: new Date() },
    ];
    if (req.body.paymentType.label !== "NTB") {
      req.body.verify = {
        status: false,
        invoice: false,
        user: req.user.name,
        date: new Date(),
      };
    }
    req.body.user = req.user._id;

    const challan = await Challan.create(req.body);

    var id = challan._id;
    const qrLink = `/update/${id}`;
    const qrCode = await QRCode.toDataURL(qrLink);

    const template = fs.readFileSync("./tmp/template.docx");
    const additionalJsContext = {
      number: challan.number,
      date: moment().format("DD/MM/YYYY"),
      serviceDate: moment(challan.serviceDate).format("DD/MM/YYYY"),
      serviceTime: challan.serviceTime.label,
      business: challan.business.label,
      area: challan.area,
      workLocation: challan.workLocation,
      sales: challan.sales.label,
      userName: req.user.name,
      amount: challan.amount.total
        ? `Amount: Rs. ${challan.amount.total} /-`
        : " ",
      paymentType: challan.paymentType.label,
      name: `${challan.shipToDetails.prefix.label} ${challan.shipToDetails.name}`,
      shipToDetails: challan.shipToDetails,
      services: challan.serviceDetails,
      contactName: challan.contactName,
      contactNo: challan.contactNo,
      contactEmail: challan.contactEmail,
      url: "12",
      qrCode: async (url12) => {
        const data = await qrCode.slice("data:image/png;base64,".length);
        return { width: 2.5, height: 2.5, data, extension: ".png" };
      },
    };

    const buffer = await createReport({
      cmdDelimiter: ["{", "}"],
      template,

      additionalJsContext,
    });

    const filePath = `./tmp/${challan.number}.docx`;
    fs.writeFileSync(filePath, buffer);
    const link = await uploadFile({ filePath, folder: "challan" });
    if (!link) {
      await Challan.findByIdAndDelete(id);
      return res.status(400).json({ msg: "Upload error, trg again later" });
    }

    admin.challanCounter += 1;
    await admin.save();
    challan.file = link;
    await challan.save();

    return res
      .status(201)
      .json({ msg: "Single service clip created", link, name: challan.number });
  } catch (error) {
    if (id) await Challan.findByIdAndDelete(id);
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const getChallan = async (req, res) => {
  const { id } = req.params;
  try {
    const challan = await Challan.findById(id);
    if (!challan) return res.status(404).json({ msg: "Challan not found" });

    return res.json(challan);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const updateChallan = async (req, res) => {
  const { id } = req.params;
  try {
    const challan = await Challan.findById(id);
    if (!challan) return res.status(404).json({ msg: "Challan not found" });

    const imageLinks = [];
    if (req.files) {
      let images = [];
      if (req.files.images.length > 0) images = req.files.images;
      else images.push(req.files.images);

      for (let i = 0; i < images.length; i++) {
        const filePath = images[i].tempFilePath;
        const link = await uploadFile({ filePath, folder: "challan" });
        if (!link)
          return res
            .status(400)
            .json({ msg: "Upload error, please try again later" });

        imageLinks.push(link);
      }
    }

    let type = "Regular";
    if (challan.update[challan.update.length - 1].status === "Completed")
      type = "Complaint";

    req.body.images = imageLinks;
    req.body.user = req.user.name;
    req.body.date = new Date();
    req.body.type = type;
    challan.update.push(req.body);
    if (req.body.amount) challan.amount.received += Number(req.body.amount);
    await challan.save();

    return res.json({ msg: "Challan updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const getAllChallan = async (req, res) => {
  const { search, page } = req.query;
  let query = {};
  if (search) {
    query = {
      $or: [
        { number: { $regex: search, $options: "i" } },
        { "shipToDetails.name": { $regex: search, $options: "i" } },
      ],
    };
  }
  try {
    let pageNumber = page || 1;

    const count = await Challan.countDocuments({ ...query });

    const challans = await Challan.find(query)
      .sort("-createdAt")
      .skip(10 * (pageNumber - 1))
      .limit(10);

    return res.json({ challans, pages: Math.min(10, Math.ceil(count / 10)) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const unverifiedChallans = async (req, res) => {
  try {
    const challans = await Challan.find({ "verify.status": false }).sort(
      "serviceDate"
    );

    return res.json(challans);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const verifyAmount = async (req, res) => {
  try {
    const challan = await Challan.findById(req.params.id);
    if (!challan) return res.status(404).json({ msg: "Challan not found" });

    challan.verify = {
      status: true,
      invoice: false,
      note: req.body.note,
      user: req.user.name,
      date: new Date(),
    };

    let forfeitedAmount = 0;
    if (challan.paymentType.label === "Bill After Job") {
      challan.billNo = req.body.billNo;
      challan.amount.received = Number(req.body.billAmount);
      forfeitedAmount = challan.amount.total - Number(req.body.billAmount);
    } else {
      forfeitedAmount = challan.amount.total - challan.amount.received;
    }
    if (forfeitedAmount > 0) challan.amount.forfeited = forfeitedAmount;
    else challan.amount.extra = forfeitedAmount * -1;

    await challan.save();

    return res.json({ msg: "Service slip verification done" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const chartData = async (req, res) => {
  try {
    const challans = await Challan.find();

    let postponed = 0,
      open = 0,
      completed = 0,
      partially = 0,
      cancelled = 0,
      cashTotal = 0,
      cashReceived = 0,
      cashForfeited = 0,
      cashExtra = 0,
      billTotal = 0,
      billReceived = 0,
      billForfeited = 0,
      billExtra = 0;
    for (let challan of challans) {
      if (
        challan.paymentType.label === "Cash To Collect" ||
        challan.paymentType.label === "UPI Payment"
      ) {
        cashTotal += challan.amount.total;
        cashReceived += challan.amount.received;
        cashForfeited += challan.amount.forfeited;
        cashExtra += challan.amount.extra;
      } else if (challan.paymentType.label === "Bill After Job") {
        billTotal += challan.amount.total;
        billReceived += challan.amount.received;
        billForfeited += challan.amount.forfeited;
        billExtra += challan.amount.extra;
      }

      const len = challan.update.length - 1;

      let status = challan.update[len].status;
      if (status === "Completed") completed += 1;
      else if (status === "Partially Completed") partially += 1;
      else if (status === "Postponed") postponed += 1;
      else if (status === "Cancelled") cancelled += 1;
      else if (status === "Created") open += 1;
    }

    const slipData = [
      { label: "Total", value: challans.length },
      { label: "Open", value: open },
      { label: "Completed", value: completed },
      { label: "Partially Completed", value: partially },
      { label: "Postponed", value: postponed },
      { label: "Cancelled", value: cancelled },
    ];

    const cashData = [
      { label: "Total", value: cashTotal },
      { label: "Received", value: cashReceived },
      {
        label: "Pending",
        value: cashTotal - cashReceived - cashForfeited + cashExtra,
      },
      { label: "Forfeited", value: cashForfeited },
      { label: "Extra", value: cashExtra },
    ];

    const billData = [
      { label: "Total", value: billTotal },
      { label: "Received", value: billReceived },
      {
        label: "Pending",
        value: billTotal - billReceived - billForfeited + billExtra,
      },
      { label: "Forfeited", value: billForfeited },
      { label: "Extra", value: billExtra },
    ];

    return res.json({ slipData, cashData, billData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const makeInvoice = async (req, res) => {
  const { gst, billAmount } = req.body;
  try {
    const challan = await Challan.findById(req.params.id);
    if (!challan) return res.status(404).json({ msg: "Challan not found" });

    challan.verify = {
      status: false,
      invoice: true,
      note: "Invoice Details Sent",
      user: req.user.name,
      date: new Date(),
    };

    challan.paymentType = { label: "Bill After Job", value: "Bill After Job" };

    const attachment = [];

    const {
      prefix,
      name,
      address,
      road,
      location,
      landmark,
      city,
      pincode,
      contactName,
      contactNo,
      contactEmail,
    } = challan.shipToDetails;

    const services = challan.serviceDetails.map(
      (item) => item.serviceName.label
    );

    const update = challan.update[challan.update.length - 1];

    const dynamicData = {
      number: challan.number,
      name: `${prefix.label}. ${name}`,
      address: `${address}, ${road}, ${location}, ${landmark}, ${city}, ${pincode}`,
      serviceName: services.join(", "),
      serviceStatus: update.status,
      serviceDate: update.jobDate || "Contact service team",
      area: challan.area,
      workLocation: challan.workLocation,
      amount: req.body.billAmount,
      gst: req.body.gst || "",
      sales: challan.sales.label,
      user: req.user.name,
    };

    update.images?.map((link, index) =>
      attachment.push({ url: link, name: `attachment-${index + 1}.jpg` })
    );

    const mail = await sendEmail({
      emailList: [{ email: "noreply.epcorn@gmail.com" }],
      attachment,
      templateId: 5,
      dynamicData,
    });
    if (!mail)
      return res.status(400).json({ msg: "Email error, try again later" });

    if (gst) challan.gst = req.body.gst;
    challan.amount.received = billAmount;
    challan.amount.received = Number(req.body.billAmount);
    const forfeitedAmount = challan.amount.total - Number(req.body.billAmount);
    if (forfeitedAmount > 0) challan.amount.forfeited = forfeitedAmount;
    else challan.amount.extra = forfeitedAmount * -1;

    await challan.save();
    return res.json({ msg: "Invoice details sent to billing team" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const getOperatorComments = async (req, res) => {
  try {
    const values = await Admin.find();
    const comment = [];

    values.map(
      (item) =>
        item.comment &&
        comment.push({
          id: item._id,
          label: item.comment.label,
          value: item.comment.value,
        })
    );

    return res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};
