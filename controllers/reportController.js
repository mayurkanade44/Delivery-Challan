import Challan from "../models/challanModel.js";
import exceljs from "exceljs";
import moment from "moment";
import {
  createReport,
  sendEmail,
  uploadFile,
} from "../utils/helperFunctions.js";
import Admin from "../models/adminModel.js";

export const dailyReport = async (req, res) => {
  try {
    const serviceDate = new Date().setUTCHours(0, 0, 0, 0);

    const todaysJob = await Challan.find({
      serviceDate,
      "paymentType.label": { $ne: "NTB" },
    });

    const cashReport = todaysJob.filter(
      (item) =>
        item.paymentType.label === "Cash To Collect" ||
        item.paymentType.label === "UPI Payment"
    );

    const billAfterJobReport = todaysJob.filter(
      (item) => item.paymentType.label === "Bill After Job"
    );

    const workbook = new exceljs.Workbook();
    let worksheet = workbook.addWorksheet("Sheet1");

    worksheet.columns = [
      { header: "Challan Number", key: "number" },
      { header: "Service Date", key: "date" },
      { header: "Payment Type", key: "paymentType" },
      { header: "Total Amount", key: "amount" },
      { header: "Received Amount", key: "receivedAmount" },
      { header: "Client Name", key: "name" },
      { header: "Client Address", key: "address" },
      { header: "Service Name", key: "service" },
      { header: "Service Status", key: "status" },
      { header: "Update By", key: "user" },
    ];

    for (let challan of cashReport) {
      const update = challan.update[challan.update.length - 1];

      worksheet.addRow({
        number: challan.number,
        date: moment(challan.serviceDate).format("DD/MM/YY"),
        paymentType: challan.paymentType.label,
        amount: challan.amount.total,
        receivedAmount: challan.amount.received,
        name: challan.shipToDetails.name,
        address: `${challan.shipToDetails.address}, ${challan.shipToDetails.location}, ${challan.shipToDetails.city}`,
        service: challan.serviceDetails.map((item) => item.serviceName.label),
        status: update.status,
        user: update.user,
      });
    }

    const filePath = "./tmp/Cash_Report.xlsx";
    await workbook.xlsx.writeFile(filePath);

    const workbook1 = new exceljs.Workbook();
    let worksheet1 = workbook1.addWorksheet("Sheet1");

    worksheet1.columns = [
      { header: "Challan Number", key: "number" },
      { header: "Service Date", key: "date" },
      { header: "Payment Type", key: "paymentType" },
      { header: "Total Amount", key: "amount" },
      { header: "GST Number", key: "gst" },
      { header: "Client Name", key: "name" },
      { header: "Client Address", key: "address" },
      { header: "Contact Person Details", key: "contact" },
      { header: "Service Name", key: "service" },
      { header: "Service Status", key: "status" },
      { header: "Image", key: "image" },
      { header: "Update By", key: "user" },
    ];

    for (let challan of billAfterJobReport) {
      const update = challan.update[challan.update.length - 1];

      worksheet1.addRow({
        number: challan.number,
        date: moment(challan.serviceDate).format("DD/MM/YY"),
        paymentType: challan.paymentType.label,
        amount: challan.amount.total,
        gst: challan.gst,
        name: `${challan.shipToDetails.prefix.value}, ${challan.shipToDetails.name}`,
        address: `${challan.shipToDetails.address}, ${challan.shipToDetails.road}, ${challan.shipToDetails.location}, ${challan.shipToDetails.city}, ${challan.shipToDetails.pincode}`,
        contact: `${challan.shipToDetails.contactName} / ${challan.shipToDetails.contactNo} / ${challan.shipToDetails.contactEmail}`,
        service: challan.serviceDetails.map((item) => item.serviceName.label),
        status: update.status,
        image: { text: "Download", hyperlink: update.images[0] } || "No Image",
        user: update.user,
      });
    }

    const filePath1 = "./tmp/Bill_After_Job.xlsx";
    await workbook1.xlsx.writeFile(filePath1);

    return res.json({ msg: "File Generated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const dailyJobDoneReport = async (req, res) => {
  const serviceDate = new Date().setUTCHours(0, 0, 0, 0);
  const attachment = [];

  try {
    const jobs = await Challan.aggregate([
      {
        $match: {
          "paymentType.label": "Bill After Job",
        },
      },
      {
        $addFields: {
          lastObject: {
            $arrayElemAt: ["$update", -1],
          },
        },
      },
      {
        $match: {
          "lastObject.status": "Completed",
          "lastObject.type": "Regular",
          "lastObject.date": {
            $gte: new Date(serviceDate),
            $lte: new Date(),
          },
        },
      },
    ]);

    if (jobs.length > 0) {
      const workbook = new exceljs.Workbook();
      let worksheet = workbook.addWorksheet("Sheet1");

      worksheet.columns = [
        { header: "Slip Number", key: "number" },
        { header: "Schedule Job Date", key: "date" },
        { header: "Job Done Date", key: "doneDate" },
        { header: "Payment Type", key: "payment" },
        { header: "Total Amount", key: "amount" },
        { header: "GST Number", key: "gst" },
        { header: "Client Name", key: "name" },
        { header: "Job Finalized By", key: "sale" },
        { header: "Client Address", key: "address" },
        { header: "Contact Person Details", key: "contact" },
        { header: "Service Name", key: "service" },
        { header: "Service Status", key: "status" },
        { header: "Image", key: "image" },
        { header: "Update By", key: "user" },
      ];

      for (let challan of jobs) {
        const update = challan.update[challan.update.length - 1];

        worksheet.addRow({
          number: challan.number,
          date: moment(challan.serviceDate).format("DD/MM/YY"),
          doneDate: moment(update.jobDate).format("DD/MM/YY"),
          payment: challan.paymentType.label,
          amount: challan.amount.total,
          gst: challan.gst,
          name: `${challan.shipToDetails.prefix.value}. ${challan.shipToDetails.name}`,
          sale: challan.sales.label,
          address: `${challan.shipToDetails.address}, ${challan.shipToDetails.road}, ${challan.shipToDetails.location}, ${challan.shipToDetails.city}, ${challan.shipToDetails.pincode}`,
          contact: `${challan.shipToDetails.contactName} / ${challan.shipToDetails.contactNo} / ${challan.shipToDetails.contactEmail}`,
          service: challan.serviceDetails
            .map((item) => item.serviceName.label)
            .join(","),
          status: update.status,
          image: { text: "Download", hyperlink: update.images[0] },
          user: update.user,
        });
      }

      const filePath = "./tmp/Bill_After_Job_Done.xlsx";
      await workbook.xlsx.writeFile(filePath);

      const url = await uploadFile({ filePath, folder: "challan" });
      if (url)
        attachment.push({
          url,
          name: `Bill After Jobs ${moment(serviceDate).format(
            "DD-MM-YY"
          )}.xlsx`,
        });
      else console.log("Bill job upload error");
    }

    const cashJobs = await Challan.aggregate([
      {
        $match: {
          "paymentType.label": "Cash To Collect" || "UPI Payment",
        },
      },
      {
        $addFields: {
          lastObject: {
            $arrayElemAt: ["$update", -1],
          },
        },
      },
      {
        $match: {
          "lastObject.status": "Completed",
          "lastObject.type": "Regular",
          "lastObject.date": {
            $gte: new Date(serviceDate),
            $lte: new Date(),
          },
          "lastObject.type": "Regular",
        },
      },
    ]);

    if (cashJobs.length > 0) {
      const filePath1 = "./tmp/Cash_Job_Done.xlsx";

      const reportFile = await createReport({
        filePath: filePath1,
        data: cashJobs,
      });

      if (!reportFile) {
        console.log("cash report error");
        return;
      }

      const url1 = await uploadFile({ filePath: filePath1, folder: "challan" });
      if (url1)
        attachment.push({
          url: url1,
          name: `Cash To Collect ${moment(serviceDate).format(
            "DD-MM-YY"
          )}.xlsx`,
        });
      else console.log("Cash report upload error");
    }

    if (attachment.length < 1)
      return res.status(404).json({ msg: "No Report Generated" });

    const date = moment(serviceDate).format("DD/MM/YY");
    const mail = await sendEmail({
      attachment,
      emailList: [
        { email: process.env.YAHOO_EMAIL },
        { email: process.env.SHWETA },
        { email: process.env.STQ },
      ],
      templateId: 6,
      dynamicData: {
        subject: `Job Done Report - ${date}`,
        description: `Completed Single Service Slip jobs report of ${date}`,
      },
    });
    if (!mail) return res.status(400).json({ msg: "Email Error" });

    return res.json({ msg: "Email Sent" });
  } catch (error) {
    console.log("Bill After Error", error);
    return false;
  }
};

export const dailyUnverifiedJobReport = async (req, res) => {
  try {
    const date = new Date();
    const serviceDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - 3
    ).setUTCHours(0, 0, 0, 0);

    const slips = await Challan.find({
      serviceDate: {
        $lte: serviceDate,
      },
      "verify.status": false,
    }).sort("serviceDate");

    if (slips.length < 1) {
      return res.status(404).json({ msg: "No Slips Found" });
    }

    const openSlips = [];
    const unverifiedSlips = [];

    slips.map((item) =>
      item.update[item.update.length - 1]?.status === "Open"
        ? openSlips.push(item)
        : unverifiedSlips.push(item)
    );

    let openSlipsUrl = null;
    let unverifiedSlipsUrl = null;

    if (openSlips.length > 0) {
      const filePath = "./tmp/Open Slips.xlsx";
      const openSlipsFile = await createReport({
        data: openSlips,
        filePath,
      });
      if (!openSlipsFile)
        return res.status(400).json({ msg: "Report Generation Error" });

      openSlipsUrl = await uploadFile({
        filePath,
        folder: "challan",
      });
      if (!openSlipsUrl)
        return res.status(400).json({ msg: "Report Upload Error" });
    }

    if (unverifiedSlips.length > 0) {
      const filePath = "./tmp/Unverified Slips.xlsx";
      const unverifiedSlipsFile = await createReport({
        data: unverifiedSlips,
        filePath,
      });
      if (!unverifiedSlipsFile)
        return res.status(400).json({ msg: "Report Generation Error" });

      unverifiedSlipsUrl = await uploadFile({
        filePath,
        folder: "challan",
      });
      if (!unverifiedSlipsUrl)
        return res.status(400).json({ msg: "Report Upload Error" });
    }

    const attachment = [];
    if (openSlipsUrl)
      attachment.push({ url: openSlipsUrl, name: `Open Slips.xlsx` });
    if (unverifiedSlipsUrl)
      attachment.push({
        url: unverifiedSlipsUrl,
        name: `Unverified Slips.xlsx`,
      });

    const emailDate = moment(serviceDate).format("DD/MM/YY");
    const mail = await sendEmail({
      attachment,
      emailList: [
        { email: process.env.YAHOO_EMAIL },
        { email: process.env.SHWETA },
        { email: process.env.STQ },
      ],
      templateId: 6,
      dynamicData: {
        subject: `Open/Unverified Jobs Report`,
        description: `Open/Unverified Single Service Slip report till ${emailDate}`,
      },
    });

    if (!mail) return res.status(400).json({ msg: "Email Error" });

    return res.json({ msg: "Email Sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

