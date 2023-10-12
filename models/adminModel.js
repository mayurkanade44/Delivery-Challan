import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    sales: { type: Object },
    serviceName: { type: Object },
    challanCounter: { type: Number },
    business: { type: Object },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
