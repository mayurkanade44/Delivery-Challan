import Admin from "../models/adminModel.js";

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
          }))
    );

    return res.json({
      sales,
      business,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error, try again later" });
  }
};
