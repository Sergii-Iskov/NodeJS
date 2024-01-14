// save in MongoDB
import express from "express";
import mongodb from "mongodb";
import bcrypt from "bcrypt";
import { DB_PASSWORD } from "../config/secret.js";

const routes = express.Router();

import session from "express-session";
import sessionFileStore from "session-file-store";
import { SESSION_PASSWORD } from "../config/secret.js";
const FileStore = sessionFileStore(session);

routes.use(
  session({
    secret: SESSION_PASSWORD,
    resave: true,
    saveUninitialized: false,
    store: new FileStore(),
    cookie: { maxAge: 3600000, secure: false, httpOnly: true },
  })
);

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
  let login = req.session.login;
  if (login) {
    try {
      const userTASKS = {
        items: [],
      };
      const collection = mongoClient.db("test").collection("tasks");
      userTASKS.items = await collection.find({ name: login }).toArray();

      console.log(userTASKS);
      return res.json(userTASKS);
    } catch (error) {
      return res.json({ error: `${error.message}` });
    }
  } else {
    return res.status(403).json({ error: "forbidden" });
  }
});

routes.post("/items", async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(500);
    const userName = req.session.login;
    const idMess = Date.now();

    const collection = mongoClient.db("test").collection("tasks");
    await collection.insertOne({
      id: idMess,
      name: userName,
      text: req.body.text,
      checked: false,
    });
    return res.json({ id: idMess });
  } catch (error) {
    return res.json({ error: `${error.message}` });
  }
});

routes.put("/items", async (req, res) => {
  if (!req.body) return res.sendStatus(500);
  try {
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
  if (!req.body) return res.sendStatus(500);
  try {
    const idMess = req.body.id;
    const collection = mongoClient.db("test").collection("tasks");
    await collection.findOneAndDelete({ id: idMess });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: `${error.message}` });
  }
});

routes.post("/login", async (req, res) => {
  if (!req.body) return res.sendStatus(500);

  try {
    const { login, pass } = req.body;
    const collection = mongoClient.db("test").collection("users");
    const user = await collection.findOne({ name: login });
    const validPass = bcrypt.compareSync(pass, user.password);

    if (validPass) {
      req.session.login = user.name;
      return res.status(201).json({ ok: true });
    } else {
      return res.status(403).json({ ok: false, error: "not found" });
    }
  } catch (error) {
    return res.json({ error: `${error.message}` });
  }
});

routes.post("/logout", (req, res) => {
  if (!req.body) return res.sendStatus(500);
  req.session.destroy((err) => {
    if (err) {
      return res.status(403).json({ error: `${err.message}` });
    } else {
      res.clearCookie("connect.sid");
      return res.status(201).json({ ok: true });
    }
  });
});

routes.post("/register", async (req, res) => {
  if (!req.body) return res.sendStatus(500);
  const { login, pass } = req.body;
  const collection = mongoClient.db("test").collection("users");
  const candidate = await collection.findOne({ name: login });

  if (candidate) {
    return res.status(403).json({ ok: false, error: "isExist" });
  }

  const hashPass = bcrypt.hashSync(pass, 7);
  const newUser = new User({ name: login, password: hashPass });
  await collection.insertOne(newUser);

  return res.status(201).json({ ok: true });
});

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async () => {
  await mongoClient.close();
  console.log("EXIT");
  process.exit();
});

export { routes as v1Mongo };
