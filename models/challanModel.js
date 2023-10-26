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
    amount: {
      total: { type: Number, default: 0 },
      received: { type: Number, default: 0 },
      forfeited: { type: Number, default: 0 },
      extra: { type: Number, default: 0 },
    },
    gst: { type: String },
    billNo: { type: String },
    paymentType: { type: Object, required: true },
    shipToDetails: { type: Object, required: true },
    serviceDetails: [Object],
    file: { type: String },
    update: [Object],
    verify: {
      status: Boolean,
      invoice: Boolean,
      user: String,
      note: String,
      date: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Challan = mongoose.model("Challan", challanSchema);
export default Challan;
