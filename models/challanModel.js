import mongoose from "mongoose";

const challanSchema = new mongoose.Schema({
  number: { type: String, required: true },
  serviceDate: { type: Date, required: true },
  serviceTime: { type: String, required: true },
  business: { type: Object, required: true },
  area: { type: String, required: true },
  workLocation: { type: String, required: true },
  sales: { type: String, required: true },
  service: [Object],
  notes: { type: String, required: true },
  sales: { type: String, required: true },
  amount: { type: String },
  status: { type: String },
  paymentType: { type: Object, required: true },
  shipToDetails: { type: Object, required: true },
  images: [String],
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   ref: "User",
  // },
});

const Challan = mongoose.model("Challan", challanSchema);
export default Challan;
