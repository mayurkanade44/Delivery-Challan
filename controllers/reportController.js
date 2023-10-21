import Challan from "../models/challanModel.js";
import exceljs from "exceljs";
import moment from "moment";

export const dailyReport = async (req, res) => {
  try {
    const serviceDate = new Date().setUTCHours(0, 0, 0, 0);

    const todaysJob = await Challan.find({
      serviceDate,
      $or: [
        { "paymentType.label": "Cash To Collect" },
        { "paymentType.label": "UPI Payment" },
      ],
    });

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

    for (let challan of todaysJob) {
      const update = challan.update[challan.update.length - 1];

      worksheet.addRow({
        number: challan.number,
        date: moment(challan.serviceDate).format("DD/MM/YY"),
        paymentType: challan.paymentType.label,
        amount: challan.amount,
        receivedAmount: challan.collectedAmount,
        name: challan.shipToDetails.name,
        address: `${challan.shipToDetails.address}, ${challan.shipToDetails.location}, ${challan.shipToDetails.city}`,
        service: challan.serviceDetails.map((item) => item.serviceName.label),
        status: update.status,
        user: update.user,
      });
    }

    const filePath = "./tmp/todaysJob.xlsx";
    await workbook.xlsx.writeFile(filePath);

    return res.json({ msg: "File Generated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};
