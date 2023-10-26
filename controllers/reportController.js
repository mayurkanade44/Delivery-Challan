import Challan from "../models/challanModel.js";
import exceljs from "exceljs";
import moment from "moment";

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
        item.paymentType.label === "Cash To Collect"
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

    for (let challan of cashReport) {
      const update = challan.update[challan.update.length - 1];

      worksheet1.addRow({
        number: challan.number,
        date: moment(challan.serviceDate).format("DD/MM/YY"),
        paymentType: challan.paymentType.label,
        amount: challan.amount.total,
        gst: challan.gst,
        name: `${challan.shipToDetails.prefix}, ${challan.shipToDetails.name}`,
        address: `${challan.shipToDetails.address}, ${challan.shipToDetails.road}, ${challan.shipToDetails.location}, ${challan.shipToDetails.city}, ${challan.shipToDetails.pincode}`,
        contact: `${challan.shipToDetails.contactName} / ${challan.shipToDetails.contactNo} / ${challan.shipToDetails.contactEmail}`,
        service: challan.serviceDetails.map((item) => item.serviceName.label),
        status: update.status,
        image: update.images[0],
        user: update.user,
      });
    }

    const filePath1 = "./tmp/Bill_After_Job.xlsx";
    await workbook.xlsx.writeFile(filePath1);

    return res.json({ msg: "File Generated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const billAfterJobReport = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};
