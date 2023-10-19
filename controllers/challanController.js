import Challan from "../models/challanModel.js";
import Admin from "../models/adminModel.js";
import moment from "moment";
import { createReport } from "docx-templates";
import fs from "fs";
import QRCode from "qrcode";
import { uploadFile } from "../utils/helperFunctions.js";

export const createChallan = async (req, res) => {
  try {
    const date = moment().format("DD#MM#YY");
    req.body.number = `#*0001*#${date}#`;
    req.body.update = [
      { status: "Created", user: req.user.name, date: new Date() },
    ];
    if (
      req.body.paymentType.label === "Cash To Collect" ||
      req.body.paymentType.label === "G-Pay Payment"
    ) {
      req.body.verify = { status: false, user: req.user.name };
    }

    const challan = await Challan.create(req.body);

    var id = challan._id;
    const qrLink = `/update/${id}`;
    const qrCode = await QRCode.toDataURL(qrLink);

    const template = fs.readFileSync("./tmp/template.docx");
    const additionalJsContext = {
      number: challan.number,
      serviceDate: moment().format("DD/MM/YYYY"),
      serviceTime: challan.serviceTime.label,
      business: challan.business.label,
      area: challan.area,
      workLocation: challan.workLocation,
      userName: "Mayur",
      sales: challan.sales.label,
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

    const filePath = `./tmp/dc.docx`;
    fs.writeFileSync(filePath, buffer);
    const link = await uploadFile({ filePath, folder: "challan" });
    if (!link) {
      await Challan.findByIdAndDelete(id);
      return res.status(400).json({ msg: "Upload error, trg again later" });
    }

    challan.file = link;
    await challan.save();

    return res.status(201).json({ msg: "DC created" });
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

    req.body.images = imageLinks;
    challan.update.push(req.body);
    if (req.body.amount) challan.collectedAmount += req.body.amount;
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
    const challans = await Challan.find({ "verify.status": false });

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

    challan.verify = { status: true, user: req.user.name, date: new Date() };
    await challan.save();

    return res.json({ msg: "Challan amount verified" });
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
      collected = 0;
    for (let challan of challans) {
      if (challan.amount) {
        total += challan.amount;
        collected += challan.collectedAmount;
      }
      const len = challan.update.length - 1;

      let status = challan.update[len].status;
      if (status === "Completed") completed += 1;
      else if (status === "Partially Completed") partially += 1;
      else if (status === "Postponed") postponed += 1;
      else if (status === "Cancelled") cancelled += 1;
      else if (status === "Created") open += 1;
    }

    const barData = [
      { label: "Total", value: challans.length },
      { label: "Open", value: open },
      { label: "Completed", value: completed },
      { label: "Partially Completed", value: partially },
      { label: "Postponed", value: postponed },
      { label: "Cancelled", value: cancelled },
    ];

    const pieData = [
      { label: "Total", value: total },
      { label: "Pending", value: total - collected },
    ];

    return res.json({ barData, pieData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};
