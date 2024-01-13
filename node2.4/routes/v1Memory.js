// save in memory
import express from "express";

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

const TASKS = {
  items: [],
};

const Users = {
  users: [],
};

routes.get("/items", (req, res) => {
  let user = req.session.login;
  if (user) {
    const userTASKS = {
      items: [],
    };
    userTASKS.items = TASKS.items.filter((task) => task.login === user);

    res.json(userTASKS);
  } else {
    res.status(403).json({ error: "forbidden" });
  }
});

routes.post("/items", (req, res) => {
  if (!req.body) return res.sendStatus(500);

  const user = req.session.login;
  const idMess = Date.now();
  const newText = req.body.text;

  let newItem = { id: idMess, login: user, text: newText, checked: false };
  TASKS.items.push(newItem);

  res.status(201).json({ id: idMess });
});

routes.put("/items", (req, res) => {
  if (!req.body) return res.sendStatus(500);

  const idMess = req.body.id;
  let changeItem = TASKS.items.find((item) => item.id === idMess);

  if (changeItem) {
    changeItem.text = req.body.text;
    changeItem.checked = req.body.checked;
    res.status(204).json({ ok: true });
  } else {
    res.status(404).json({ ok: false });
  }
});

routes.delete("/items", (req, res) => {
  try {
    const idMess = req.body.id;
    TASKS.items = TASKS.items.filter((item) => item.id !== idMess);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false });
  }
});

routes.post("/login", (req, res) => {
  if (!req.body) return res.sendStatus(500);
  const { login, pass } = req.body;

  const user = Users.users.find(
    (user) => user.login === login && user.pass === pass
  );

  if (user) {
    req.session.login = user.login;
    res.status(201).json({ ok: true });
  } else {
    res.status(403).json({ ok: false, error: "not found" });
  }
});

routes.post("/logout", (req, res) => {
  if (!req.body) return res.sendStatus(500);
  req.session.destroy((err) => {
    if (err) {
      return res.status(403).json({ error: `${err.message}` });
    } else {
      res.clearCookie("connect.sid");
      res.status(201).json({ ok: true });
    }
  });
});

routes.post("/register", (req, res) => {
  if (!req.body) return res.sendStatus(500);
  const { login, pass } = req.body;
  const isExist = Users.find((user) => user.login === login) ? true : false;

  if (isExist) {
    return res.status(403).json({ ok: false, error: "isExist" });
  } else {
    Users.push({ login, pass });
    return res.status(201).json({ ok: true });
  }
});

export { routes as v1Memory };
