import express, { Router, Request, Response } from "express";
import fs from "fs";
import session from "express-session";
import sessionFileStore from "session-file-store";
import { SESSION_PASSWORD } from "../config/secret.js";
import { TaskList, Task, UserList, User } from "../models/fileAndMemory.js";

const FileStore = sessionFileStore(session);
const routes: Router = express.Router();

routes.use(
  session({
    secret: SESSION_PASSWORD,
    resave: true,
    saveUninitialized: false,
    store: new FileStore(),
    cookie: { maxAge: 3600000, secure: false, httpOnly: true },
  })
);

routes.get("/items", (req: Request, res: Response) => {
  const user: string | undefined = req.session.login;
  if (user) {
    const userTASKS: TaskList = {
      items: [],
    };
    const content: string = fs.readFileSync("items.json", "utf8");
    const TASKS: TaskList = JSON.parse(content);
    userTASKS.items = TASKS.items.filter((task) => task.name === user);

    console.log(TASKS);
    res.json(userTASKS);
  } else {
    res.status(403).json({ error: "forbidden" });
  }
});

routes.post("/items", (req: Request, res: Response) => {
  try {
    const user: string | undefined = req.session.login;
    const idMess: number = Date.now();
    const newText: string = req.body.text;

    let newItem: Task = {
      id: idMess,
      name: user,
      text: newText,
      checked: false,
    };
    const content: string = fs.readFileSync("items.json", "utf8");
    const TASKS: TaskList = JSON.parse(content);

    if (!TASKS.items) {
      const TASKS: TaskList = {
        items: [],
      };
    }

    TASKS.items.push(newItem);
    let data: string = JSON.stringify(TASKS);
    fs.writeFileSync("items.json", data);

    res.status(201).json({ id: idMess });
  } catch (error) {
    return res.status(500).json({ ok: false });
  }
});

routes.put("/items", (req: Request, res: Response) => {
  try {
    const content: string = fs.readFileSync("items.json", "utf8");
    const TASKS: TaskList = JSON.parse(content);

    const idMess: number = req.body.id;
    let changeItem: Task | undefined = TASKS.items.find(
      (item) => item.id === idMess
    );

    if (changeItem) {
      changeItem.text = req.body.text;
      changeItem.checked = req.body.checked;

      let data: string = JSON.stringify(TASKS);
      fs.writeFileSync("items.json", data);
      res.status(204).json({ ok: true });
    } else {
      res.status(404).json({ ok: false });
    }
  } catch (error) {
    return res.status(500).json({ ok: false });
  }
});

routes.delete("/items", (req: Request, res: Response) => {
  try {
    const idMess: number = req.body.id;
    const content: string = fs.readFileSync("items.json", "utf8");
    const TASKS: TaskList = JSON.parse(content);

    TASKS.items = TASKS.items.filter((item) => item.id !== idMess);
    let data: string = JSON.stringify(TASKS);
    fs.writeFileSync("items.json", data);

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false });
  }
});

routes.post("/login", (req: Request, res: Response) => {
  try {
    const { login, pass }: { login: string; pass: string } = req.body;

    const content: string = fs.readFileSync("./config/users.json", "utf8");
    const USERS: UserList = JSON.parse(content);
    const curUser: User | undefined = USERS.users.find(
      (user) => user.name === login && user.pass === pass
    );

    if (curUser) {
      req.session.login = curUser.name;
      res.status(201).json({ ok: true });
    } else {
      res.status(403).json({ ok: false, error: "not found" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false });
  }
});

routes.post("/logout", (req: Request, res: Response) => {
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

routes.post("/register", (req: Request, res: Response) => {
  try {
    const { login, pass }: { login: string; pass: string } = req.body;
    const content: string = fs.readFileSync("./config/users.json", "utf8");
    const allUsers: UserList = JSON.parse(content);

    if (!allUsers.users) {
      const allUsers: UserList = {
        users: [],
      };
    }

    const isExist: boolean = allUsers.users.find((user) => user.name === login)
      ? true
      : false;
    if (isExist) {
      return res.status(403).json({ ok: false, error: "isExist" });
    } else {
      allUsers.users.push({ name: login, pass });
      let data: string = JSON.stringify(allUsers);
      fs.writeFileSync("./config/users.json", data);
      return res.status(201).json({ ok: true });
    }
  } catch (error) {
    return res.status(500).json({ ok: false });
  }
});

export { routes as v1File };
