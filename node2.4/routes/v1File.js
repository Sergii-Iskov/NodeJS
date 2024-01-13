// save in file
import express from "express";
import fs from "fs";

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

routes.get("/items", (req, res) => {
  let user = req.session.login;
  if (user) {
    const userTASKS = {
      items: [],
    };
    const content = fs.readFileSync("items.json", "utf8");
    const TASKS = JSON.parse(content);
    userTASKS.items = TASKS.items.filter((task) => task.login === user);

    console.log(TASKS);
    res.json(userTASKS);
  } else {
    res.status(403).json({ error: "forbidden" });
  }
});

routes.post("/items", (req, res) => {
  if (!req.body) return res.sendStatus(500);
  try {
    const user = req.session.login;
    const idMess = Date.now();
    const newText = req.body.text;

    let newItem = { id: idMess, login: user, text: newText, checked: false };
    const content = fs.readFileSync("items.json", "utf8");
    const TASKS = JSON.parse(content);

    if (!TASKS.items) {
      const TASKS = {
        items: [],
      };
    }

    TASKS.items.push(newItem);
    let data = JSON.stringify(TASKS);
    fs.writeFileSync("items.json", data);

    res.status(201).json({ id: idMess });
  } catch (error) {
    return res.json({ error: `${error.message}` });
  }
});

routes.put("/items", (req, res) => {
  if (!req.body) return res.sendStatus(500);

  try {
    const content = fs.readFileSync("items.json", "utf8");
    const TASKS = JSON.parse(content);

    const idMess = req.body.id;
    let changeItem = TASKS.items.find((item) => item.id === idMess);

    if (changeItem) {
      changeItem.text = req.body.text;
      changeItem.checked = req.body.checked;

      let data = JSON.stringify(TASKS);
      fs.writeFileSync("items.json", data);
      res.status(204).json({ ok: true });
    } else {
      res.status(404).json({ ok: false });
    }
  } catch (error) {
    return res.json({ error: `${error.message}` });
  }
});

routes.delete("/items", (req, res) => {
  try {
    const idMess = req.body.id;
    const content = fs.readFileSync("items.json", "utf8");
    const TASKS = JSON.parse(content);

    TASKS.items = TASKS.items.filter((item) => item.id !== idMess);
    let data = JSON.stringify(TASKS);
    fs.writeFileSync("items.json", data);

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false });
  }
});

routes.post("/login", (req, res) => {
  if (!req.body) return res.sendStatus(500);

  try {
    const { login, pass } = req.body;

    const content = fs.readFileSync("./config/users.json", "utf8");
    const USERS = JSON.parse(content);
    const curUser = USERS.users.find(
      (user) => user.login === login && user.pass === pass
    );

    if (curUser) {
      req.session.login = curUser.login;
      res.status(201).json({ ok: true });
    } else {
      res.status(403).json({ ok: false, error: "not found" });
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
      res.status(201).json({ ok: true });
    }
  });
});

routes.post("/register", (req, res) => {
  if (!req.body) return res.sendStatus(500);

  try {
    const { login, pass } = req.body;
    const content = fs.readFileSync("./config/users.json", "utf8");
    const allUsers = JSON.parse(content);

    if (!allUsers.users) {
      const allUsers = {
        users: [],
      };
    }

    const isExist = allUsers.users.find((user) => user.login === login)
      ? true
      : false;
    if (isExist) {
      return res.status(403).json({ ok: false, error: "isExist" });
    } else {
      allUsers.users.push({ login, pass });
      let data = JSON.stringify(allUsers);
      fs.writeFileSync("./config/users.json", data);
      return res.status(201).json({ ok: true });
    }
  } catch (error) {
    return res.json({ error: `${error.message}` });
  }
});

export { routes as v1File };
