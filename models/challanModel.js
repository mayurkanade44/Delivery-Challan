import mongoose from "mongoose";

const challanSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    serviceDate: { type: Date, required: true },
    serviceTime: { type: Object, required: true },
    business: { type: Object, required: true },
    area: { type: String, required: true },
    workLocation: { type: String, required: true },
    sales: { type: Object, required: true },
    service: [Object],
    notes: { type: String, required: true },
    sales: { type: String, required: true },
    amount: { type: String },
    paymentType: { type: Object, required: true },
    shipToDetails: { type: Object, required: true },
    status: { type: String },
    images: [String],
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "User",
    // },
  },
  { timestamps: true }
);

const Challan = mongoose.model("Challan", challanSchema);
export default Challan;
