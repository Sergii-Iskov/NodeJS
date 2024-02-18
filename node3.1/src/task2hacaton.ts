import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import path from "path";
import { direction } from "./direct.js";

const app = express(); // npm run startH
const PORT: number = parseInt(process.env.PORT ?? "3000"); // http://localhost:3000/
const __dirname = path.resolve();
let count: number = 0;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get("/", (req: express.Request, res: express.Response) => {
  res.sendFile(__dirname + "/static/index.html");
});

app.get("/:dir", (req: express.Request, res: express.Response) => {
  let command = req.params.dir;
  if (command == direction.plus) count += 1;
  if (command == direction.minus) count -= 1;
  res.status(200).json({ result: `${count}` });
});

app.listen(PORT, (error?: Error) => {
  if (error) {
    console.log("We have a problem ", error);
    return;
  }
  console.log(`listening on port ${PORT}`);
});
