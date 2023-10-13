import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    challanCounter: { type: Number },
    sales: { type: Object },
    services: { type: Object },
    business: { type: Object },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
