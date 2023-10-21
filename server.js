import express from "express";
import path from "path";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

import challanRoute from "./routes/challanRoute.js";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import reportRoute from "./routes/reportRoute.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.use("/api/user", userRoute);
app.use("/api/challan", authenticateUser, challanRoute);
app.use("/api/admin", adminRoute);
app.use("/api/report", reportRoute);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

const port = process.env.PORT || 5000;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(port, () => console.log("server is listing"));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();
