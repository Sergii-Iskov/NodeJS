import express from "express";
// import { v1Routes } from "./routes/v1Memory.js";
import { v1Routes } from "./routes/v1File.js";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import morgan from "morgan";

const app = express();
const __dirname = path.resolve();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "static", "index.html"));
});

app.use("/api/v1", v1Routes);

export { app };
