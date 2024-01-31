import express, { Router, Request, Response } from "express";
import mongodb, { OptionalId } from "mongodb";
import bcrypt from "bcrypt";
import { DB_PASSWORD, SESSION_PASSWORD } from "../config/secret.js";
import { TaskList, Task, User } from "../models/mongo.js";

import session from "express-session";
import sessionFileStore from "session-file-store";
const FileStore = sessionFileStore(session);
const routes: Router = express.Router();

// declare type Task = mongodb.OptionalId<mongodb.Document> & {
//   // _id?: mongodb.BSON.ObjectId | undefined;
//   id: number;
//   name: string;
//   text: string;
//   checked: boolean;
// }; // https://jira.mongodb.org/browse/NODE-4470

// interface TaskList {
//   items: Task[];
// }

// declare type User = mongodb.OptionalId<mongodb.Document> & {
//   name: string;
//   pass: string;
// };

routes.use(
  session({
    secret: SESSION_PASSWORD,
    resave: true,
    saveUninitialized: false,
    store: new FileStore(),
    cookie: { maxAge: 3600000, secure: false, httpOnly: true },
  })
);

const URI: string = `mongodb+srv://sergaiskov:${DB_PASSWORD}@cluster0.yssjlla.mongodb.net/?retryWrites=true&w=majority`;
const mongoClient: mongodb.MongoClient = new mongodb.MongoClient(URI);

(async (): Promise<void> => {
  try {
    await mongoClient.connect();
  } catch (err) {
    return console.log(err);
  }
})();

routes.get("/items", async (req: Request, res: Response): Promise<Response> => {
  const user: string | undefined = req.session.login;
  if (user) {
    try {
      const userTASKS: TaskList = {
        items: [],
      };
      const collection: mongodb.Collection = mongoClient
        .db("test")
        .collection("tasks");
      userTASKS.items = (await collection
        .find({ name: user })
        .toArray()) as Task[];

      console.log(userTASKS);
      return res.json(userTASKS);
    } catch (error) {
      return res.status(500).json({ ok: false });
    }
  } else {
    return res.status(403).json({ error: "forbidden" });
  }
});

routes.post(
  "/items",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const userName: string = req.session.login;
      const idMess: number = Date.now();

      const collection: mongodb.Collection = mongoClient
        .db("test")
        .collection("tasks");
      await collection.insertOne({
        id: idMess,
        name: userName,
        text: req.body.text,
        checked: false,
      });
      return res.json({ id: idMess });
    } catch (error) {
      return res.status(500).json({ ok: false });
    }
  }
);

routes.put("/items", async (req: Request, res: Response): Promise<Response> => {
  try {
    const idMess: number = req.body.id;
    const collection: mongodb.Collection = mongoClient
      .db("test")
      .collection("tasks");
    await collection.findOneAndUpdate(
      { id: idMess },
      { $set: { text: req.body.text, checked: req.body.checked } },
      { returnDocument: "after" }
    );
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false });
  }
});

routes.delete(
  "/items",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const idMess: number = req.body.id;
      const collection: mongodb.Collection = mongoClient
        .db("test")
        .collection("tasks");
      await collection.findOneAndDelete({ id: idMess });
      return res.json({ ok: true });
    } catch (error) {
      return res.status(500).json({ ok: false });
    }
  }
);

routes.post(
  "/login",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { login, pass }: { login: string; pass: string } = req.body;
      const collection: mongodb.Collection = mongoClient
        .db("test")
        .collection("users");
      const user = (await collection.findOne({
        name: login,
      })) as User;
      const validPass: boolean = bcrypt.compareSync(pass, user.password);

      if (validPass) {
        req.session.login = user.name;
        return res.status(201).json({ ok: true });
      } else {
        return res.status(403).json({ ok: false, error: "not found" });
      }
    } catch (error) {
      return res.status(500).json({ ok: false });
    }
  }
);

routes.post("/logout", (req: Request, res: Response) => {
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

routes.post(
  "/register",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { login, password }: { login: string; password: string } = req.body;
      const collection: mongodb.Collection = mongoClient
        .db("test")
        .collection("users");
      const candidate: any = await collection.findOne({ name: login });

      if (candidate) {
        return res.status(403).json({ ok: false, error: "isExist" });
      }

      const hashPass: string = bcrypt.hashSync(password, 7);
      const newUser: User = { name: login, pass: hashPass };
      await collection.insertOne(newUser);

      return res.status(201).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ ok: false });
    }
  }
);

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async (): Promise<void> => {
  await mongoClient.close();
  console.log("EXIT");
  process.exit();
});

export { routes as v1Mongo };
