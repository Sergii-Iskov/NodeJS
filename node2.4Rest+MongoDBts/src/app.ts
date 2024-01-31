import express, { Express, Request, Response } from "express";
import { v1Memory } from "./routes/v1Memory.js";
import { v1File } from "./routes/v1File.js";
import { v1Mongo } from "./routes/v1Mongo.js";
import { v1Mongoose } from "./routes/v1Mongoose.js";
import { v2 } from "./routes/v2.js";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import morgan from "morgan";

declare module "express-session" {
  export interface Session {
    login: string;
    pass: string;
  }
}
// "@types/express-session": "^1.17.10",

const app = express();
const __dirname = path.resolve();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.sendFile(path.resolve(__dirname, "static", "index.html"));
});

app.use("/api/v1/memory", v1Memory);
app.use("/api/v1/file", v1File);
app.use("/api/v1/mongo", v1Mongo);
app.use("/api/v1/mongoose", v1Mongoose);
app.use("/api/v2/router", v2);

export { app };
