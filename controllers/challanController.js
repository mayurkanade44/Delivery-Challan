import moment from "moment";
import { createReport } from "docx-templates";
import fs from "fs";

export const createChallan = async (req, res) => {
  try {
    const date = moment().format("DD#MM#YY");
    req.body.number = `#*0001*#${date}#`;

    const challan = req.body;

    const template = fs.readFileSync("./tmp/template.docx");
    const additionalJsContext = {
      number: challan.number,
      serviceDate: moment().format("DD/MM/YYYY"),
      serviceTime: challan.serviceTime,
      business: challan.business,
      area: challan.area,
      workLocation: challan.workLocation,
      userName: "Mayur",
      sales: challan.sales,
      amount: challan.amount,
      paymentType: challan.paymentType,
      name: challan.name,
      address: challan.address,
      road: challan.road,
      city: challan.city,
      nearBy: challan.nearBy,
      location:challan.location
    };

    const buffer = await createReport({
      cmdDelimiter: ["{", "}"],
      template,

      additionalJsContext,
    });

    const filePath = `./tmp/dc.docx`;
    fs.writeFileSync(filePath, buffer);
    return res.json({ msg: "DC created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};
