import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";

// import fs from "fs";

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT ?? 3000; // http://localhost:3000/
let id = 0;

// create application/json parser
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let items = [{ data: { text: "text", checked: true }, index: 11 }];

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "static", "index.html"));
});

app.get("/api/v1/items", (req, res) => {
  // const content = fs.readFileSync("items.js", "utf8");
  res.json(items);
});

app.post("/api/v1/items", urlencodedParser, (req, res) => {
  // app.post("/api/v1/items/", jsonParser, function (req, res) {
  // const idMess = Date.now();
  id++;
  const text = req.body.text;
  let newItem = { data: text, index: id, checked: true };
  items.push(newItem);
  res.send(JSON.stringify(items));
});

app.listen(PORT, (error) => {
  if (error) {
    console.log("We have a problem ", error);
    return;
  }
  console.log(`listening on port ${PORT}`);
}); // npm run server
