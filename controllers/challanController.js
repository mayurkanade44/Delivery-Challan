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
      amount: challan.amount ? `Amount: Rs. ${challan.amount} /-` : " ",
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
        return { width: 3, height: 3, data, extension: ".png" };
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
    if (req.body.amount) challan.collectedAmount += Number(req.body.amount);
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
    const challans = await Challan.find(query).sort("-createdAt");

    return res.json(challans);
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

    const forfeitedAmount = challan.amount - challan.collectedAmount;

    if (forfeitedAmount > 0) challan.forfeitedAmount = forfeitedAmount;

    if (challan.paymentType.label === "Bill After Job")
      challan.collectedAmount = Number(challan.amount);

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
      total = 0,
      collected = 0,
      forfeited = 0;
    for (let challan of challans) {
      if (challan.amount) {
        total += challan.amount;
        collected += challan.collectedAmount;
        forfeited += challan.forfeitedAmount || 0;
      }
      const len = challan.update.length - 1;

      let status = challan.update[len].status;
      if (status === "Completed") completed += 1;
      else if (status === "Partially Completed") partially += 1;
      else if (status === "Postponed") postponed += 1;
      else if (status === "Cancelled") cancelled += 1;
      else if (status === "Created") open += 1;
    }

    const barData1 = [
      { label: "Total", value: challans.length },
      { label: "Open", value: open },
      { label: "Completed", value: completed },
      { label: "Half Completed", value: partially },
      { label: "Postponed", value: postponed },
      { label: "Cancelled", value: cancelled },
    ];

    const barData2 = [
      { label: "Total", value: total },
      { label: "Collected", value: collected },
      { label: "Pending", value: total - collected - forfeited },
      { label: "Forfeited", value: forfeited },
    ];

    return res.json({ barData1, barData2 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const makeInvoice = async (req, res) => {
  try {
    const challan = await Challan.findById(req.params.id);
    if (!challan) return res.status(404).json({ msg: "Challan not found" });

    challan.verify = {
      status: true,
      invoice: true,
      note: "Invoice Details Sent",
      user: req.user.name,
      date: new Date(),
    };

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
      amount: challan.amount,
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

    if (req.body.gst) challan.gst = req.body.gst;
    challan.amount = 0;
    challan.collectedAmount = 0;

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
