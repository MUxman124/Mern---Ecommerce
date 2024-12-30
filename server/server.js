import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import winston from "winston";
import connectDB from "./database/db.js";
import router from "./routes/routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174", "https://yourfrontend.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

connectDB();

app.use("/", router);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  winston.info(`Server is running on port ${PORT}`);
});
