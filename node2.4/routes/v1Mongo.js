// save in MongoDB
import express from "express";
import mongodb from "mongodb";
import { DB_PASSWORD } from "../config/secret.js";

const routes = express.Router();

const URI = `mongodb+srv://sergaiskov:${DB_PASSWORD}@cluster0.yssjlla.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new mongodb.MongoClient(URI);

(async () => {
  try {
    await mongoClient.connect();
  } catch (err) {
    return console.log(err);
  }
})();

routes.get("/items", async (req, res) => {
  try {
    const TASKS = {
      items: [],
    };
    const collection = mongoClient.db("test").collection("tasks");
    TASKS.items = await collection.find({}).toArray();

    console.log(TASKS);
    return res.json(TASKS);
  } catch (error) {
    return res.json({ error: `${error.message}` });
  }
});

routes.post("/items", async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(500);

    const idMess = Date.now();
    const newText = req.body.text;
    let newTask = { id: idMess, text: newText, checked: false };

    const collection = mongoClient.db("test").collection("tasks");
    await collection.insertOne(newTask);
    return res.json({ id: idMess });
  } catch (error) {
    return res.json({ error: `${error.message}` });
  }
});

routes.put("/items", async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(500);

    const idMess = req.body.id;

    const collection = mongoClient.db("test").collection("tasks");
    await collection.findOneAndUpdate(
      { id: idMess },
      { $set: { text: req.body.text, checked: req.body.checked } },
      { returnDocument: "after" }
    );
    return res.json({ ok: true });
  } catch (error) {
    return res.json({ error: `${error.message}` });
  }
});

routes.delete("/items", async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(500);

    const idMess = req.body.id;

    const collection = mongoClient.db("test").collection("tasks");
    await collection.findOneAndDelete({ id: idMess });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: `${error.message}` });
  }
});

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async () => {
  await mongoClient.close();
  console.log("EXIT");
  process.exit();
});

export { routes as v1Mongo };
