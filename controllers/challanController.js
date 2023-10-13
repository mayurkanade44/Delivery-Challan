import Challan from "../models/challanModel.js";
import Admin from "../models/adminModel.js";
import moment from "moment";
import { createReport } from "docx-templates";
import fs from "fs";
import QRCode from "qrcode";

export const createChallan = async (req, res) => {
  const { business, sales } = req.body;
  try {
    const date = moment().format("DD#MM#YY");
    req.body.number = `#*0001*#${date}#`;

    const challan = await Challan.create(req.body);

    var id = challan._id;
    const qrLink = `/update-challan/${id}`;
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
      amount: challan.amount,
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

    return res.status(201).json({ msg: "DC created" });
  } catch (error) {
    if (id) await Challan.findByIdAndDelete(id);
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};
