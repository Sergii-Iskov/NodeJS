// save in MongoDB
import express from "express";
import mongoose from "mongoose";
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

const taskSchema = new mongoose.Schema({
  id: {
    type: "number",
    require: [true, "Task description is required"],
  },
  name: {
    type: "string",
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

const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    require: [true, "Task description is required"],
  },
  password: {
    type: "string",
    require: [true, "Task description is required"],
  },
});

const Task = mongoose.model("TASK", taskSchema);
const User = mongoose.model("USER", userSchema);
const URI = `mongodb+srv://sergaiskov:${DB_PASSWORD}@cluster0.yssjlla.mongodb.net/?retryWrites=true&w=majority`;

(async () => {
  try {
    await mongoose.connect(URI);
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
      userTASKS.items = await Task.find({ name: login });

      console.log(userTASKS);
      return res.json(userTASKS);
    } catch (error) {
      return res.status(500).json({ error: `${error.message}` });
    }
  } else {
    return res.status(403).json({ error: "forbidden" });
  }
});

routes.post("/items", async (req, res) => {
  if (!req.body) return res.sendStatus(500);
  try {
    const userName = req.session.login;
    const idMess = Date.now();

    await Task.create({
      id: idMess,
      name: userName,
      text: req.body.text,
    });
    return res.status(201).json({ id: idMess });
  } catch (error) {
    return res.status(500).json({ error: `${error.message}` });
  }
});

routes.put("/items", async (req, res) => {
  if (!req.body) return res.sendStatus(500);
  try {
    const idMess = req.body.id;
    const { text, checked } = req.body;
    await Task.findOne(
      { id: idMess },
      { text: req.body.text, checked: req.body.checked },
      { new: true }
    );
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: `${error.message}` });
  }
});

routes.delete("/items", async (req, res) => {
  if (!req.body) return res.sendStatus(500);
  try {
    const idMess = req.body.id;
    await Task.deleteOne({ id: idMess });
    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `${error.message}` });
  }
});

routes.post("/login", async (req, res) => {
  if (!req.body) return res.sendStatus(500);

  try {
    const { login, pass } = req.body;
    const user = await User.findOne({ name: login });
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
  const candidate = await User.findOne({ name: login });

  if (candidate) {
    return res.status(403).json({ ok: false, error: "isExist" });
  }
  const hashPass = bcrypt.hashSync(pass, 7);
  const newUser = new User({ name: login, password: hashPass });
  await newUser.save();

  return res.status(201).json({ ok: true });
});

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("Приложение завершило работу");
  process.exit();
});

export { routes as v1Mongoose };
