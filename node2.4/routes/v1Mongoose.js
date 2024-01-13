// save in MongoDB
import express from "express";
import mongoose from "mongoose";
import { DB_PASSWORD } from "../config/secret.js";

const routes = express.Router();

const taskSchema = new mongoose.Schema({
  id: {
    type: "number",
    require: [true, "Task description is required"],
  },
  text: {
    type: "string",
    require: [true, "Task description is required"],
  },
  checked: {
    type: "boolean",
    default: false,
  },
});

const Task = mongoose.model("TASK", taskSchema);
const URI = `mongodb+srv://sergaiskov:${DB_PASSWORD}@cluster0.yssjlla.mongodb.net/?retryWrites=true&w=majority`;

(async () => {
  try {
    await mongoose.connect(URI);
  } catch (err) {
    return console.log(err);
  }
})();

routes.get("/items", async (req, res) => {
  try {
    const TASKS = {
      items: [],
    };
    TASKS.items = await Task.find({});

    console.log(TASKS);
    return res.json(TASKS);
  } catch (error) {
    res.status(500).json({ error: "forbidden" });
  }
});

routes.post("/items", async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(500);

    const idMess = Date.now();
    const TASKS = await Task.create({
      id: idMess,
      text: req.body.text,
    });
    res.status(201).json({ id: idMess });
  } catch (error) {
    return res.status(500).json({ error: `${error.message}` });
  }
});

routes.put("/items", async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(500);

    const idMess = req.body.id;
    const { text, checked } = req.body;
    const TASKS = await Task.findByIdAndUpdate(
      idMess,
      { text, checked },
      { new: true }
    );
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: `${error.message}` });
  }
});

routes.delete("/items", async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(500);

    const idMess = req.body.id;
    const TASKS = await Task.findByIdAndDelete(idMess);
    console.log(TASKS);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: `${error.message}` });
  }
});

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("Приложение завершило работу");
  process.exit();
});

export { routes as v1Mongoose };
