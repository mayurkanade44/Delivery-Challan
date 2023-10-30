import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import { sorting } from "../utils/helperFunctions.js";

export const addAdminValue = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(201).json({ msg: "Added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const getAllValues = async (req, res) => {
  try {
    const values = await Admin.find();

    const sales = [];
    const business = [];
    const services = [];
    const comment = [];
    values.map(
      (item) =>
        (item.sales &&
          sales.push({
            id: item._id,
            label: item.sales.label,
            value: item.sales.value,
          })) ||
        (item.business &&
          business.push({
            id: item._id,
            label: item.business.label,
            value: item.business.value,
          })) ||
        (item.services &&
          services.push({
            id: item._id,
            label: item.services.label,
            value: item.services.value,
          })) ||
        (item.comment &&
          comment.push({
            id: item._id,
            label: item.comment.label,
            value: item.comment.value,
          }))
    );

    sorting(services);
    sorting(business);
    sorting(sales);

    return res.json({
      sales,
      business,
      services,
      comment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const deleteAdminValue = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};
