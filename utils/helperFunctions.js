import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import jwt from "jsonwebtoken";
import SibApiV3Sdk from "@getbrevo/brevo";
import exceljs from "exceljs";
import moment from "moment";

export const uploadFile = async ({ filePath, folder }) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      use_filename: true,
      folder,
      quality: 40,
      resource_type: "auto",
    });

    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    console.log("Cloud Upload", error);
    return false;
  }
};

export const capitalLetter = (phrase) => {
  return phrase
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const sendEmail = async ({
  attachment,
  dynamicData,
  emailList,
  templateId,
}) => {
  try {
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_KEY;
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "EPCORN",
      email: "exteam.epcorn@gmail.com",
    };
    sendSmtpEmail.to = emailList;
    sendSmtpEmail.params = dynamicData;
    sendSmtpEmail.templateId = templateId;
    if (attachment) sendSmtpEmail.attachment = attachment;
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const sorting = (data) => {
  data.sort((a, b) => {
    const nameA = a.label.toUpperCase();
    const nameB = b.label.toUpperCase();
    if (nameA > nameB) {
      return 1;
    }
    if (nameA < nameB) {
      return -1;
    }
    return 0;
  });
};

export const createReport = async ({ data, filePath }) => {
  try {
    const workbook = new exceljs.Workbook();
    let worksheet = workbook.addWorksheet("Sheet1");

    worksheet.columns = [
      { header: "Slip Number", key: "number" },
      { header: "Schedule Job Date", key: "date" },
      { header: "Job Done Date", key: "doneDate" },
      { header: "Payment Type", key: "payment" },
      { header: "Total Amount", key: "amount" },
      { header: "Received Amount", key: "received" },
      { header: "Client Name", key: "name" },
      { header: "Job Finalized By", key: "sale" },
      { header: "Client Address", key: "address" },
      { header: "Contact Person Details", key: "contact" },
      { header: "Service Name", key: "service" },
      { header: "Service Status", key: "status" },
      { header: "Job Comment", key: "comment" },
      { header: "Image", key: "image" },
      { header: "Update By", key: "user" },
    ];

    for (let challan of data) {
      const update = challan.update[challan.update.length - 1];

      worksheet.addRow({
        number: challan.number,
        date: moment(challan.serviceDate).format("DD/MM/YY"),
        doneDate: moment(update.jobDate).format("DD/MM/YY"),
        payment: challan.paymentType.label,
        amount: challan.amount.total,
        received: challan.amount.received,
        name: `${challan.shipToDetails.prefix.value}. ${challan.shipToDetails.name}`,
        sale: challan.sales.label,
        address: `${challan.shipToDetails.address}, ${challan.shipToDetails.road}, ${challan.shipToDetails.location}, ${challan.shipToDetails.city}, ${challan.shipToDetails.pincode}`,
        contact: `${challan.shipToDetails.contactName} / ${challan.shipToDetails.contactNo} / ${challan.shipToDetails.contactEmail}`,
        service: challan.serviceDetails
          .map((item) => item.serviceName.label)
          .join(","),
        status: update.status,
        comment: update.comment,
        image:
          (update.images && {
            text: "Download",
            hyperlink: update.images[0],
          }) ||
          "NA",
        user: update.user,
      });
    }

    await workbook.xlsx.writeFile(filePath);

    return true;
  } catch (error) {
    console.log("Report Error", error);
    return false;
  }
};
