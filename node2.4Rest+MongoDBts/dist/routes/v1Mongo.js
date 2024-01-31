var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import mongodb from "mongodb";
import bcrypt from "bcrypt";
import { DB_PASSWORD, SESSION_PASSWORD } from "../config/secret.js";
import session from "express-session";
import sessionFileStore from "session-file-store";
const FileStore = sessionFileStore(session);
const routes = express.Router();
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
routes.use(session({
    secret: SESSION_PASSWORD,
    resave: true,
    saveUninitialized: false,
    store: new FileStore(),
    cookie: { maxAge: 3600000, secure: false, httpOnly: true },
}));
const URI = `mongodb+srv://sergaiskov:${DB_PASSWORD}@cluster0.yssjlla.mongodb.net/?retryWrites=true&w=majority`;
const mongoClient = new mongodb.MongoClient(URI);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoClient.connect();
    }
    catch (err) {
        return console.log(err);
    }
}))();
routes.get("/items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.session.login;
    if (user) {
        try {
            const userTASKS = {
                items: [],
            };
            const collection = mongoClient
                .db("test")
                .collection("tasks");
            userTASKS.items = (yield collection
                .find({ name: user })
                .toArray());
            console.log(userTASKS);
            return res.json(userTASKS);
        }
        catch (error) {
            return res.status(500).json({ ok: false });
        }
    }
    else {
        return res.status(403).json({ error: "forbidden" });
    }
}));
routes.post("/items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userName = req.session.login;
        const idMess = Date.now();
        const collection = mongoClient
            .db("test")
            .collection("tasks");
        yield collection.insertOne({
            id: idMess,
            name: userName,
            text: req.body.text,
            checked: false,
        });
        return res.json({ id: idMess });
    }
    catch (error) {
        return res.status(500).json({ ok: false });
    }
}));
routes.put("/items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idMess = req.body.id;
        const collection = mongoClient
            .db("test")
            .collection("tasks");
        yield collection.findOneAndUpdate({ id: idMess }, { $set: { text: req.body.text, checked: req.body.checked } }, { returnDocument: "after" });
        return res.json({ ok: true });
    }
    catch (error) {
        return res.status(500).json({ ok: false });
    }
}));
routes.delete("/items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idMess = req.body.id;
        const collection = mongoClient
            .db("test")
            .collection("tasks");
        yield collection.findOneAndDelete({ id: idMess });
        return res.json({ ok: true });
    }
    catch (error) {
        return res.status(500).json({ ok: false });
    }
}));
routes.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { login, pass } = req.body;
        const collection = mongoClient
            .db("test")
            .collection("users");
        const user = (yield collection.findOne({
            name: login,
        }));
        const validPass = bcrypt.compareSync(pass, user.password);
        if (validPass) {
            req.session.login = user.name;
            return res.status(201).json({ ok: true });
        }
        else {
            return res.status(403).json({ ok: false, error: "not found" });
        }
    }
    catch (error) {
        return res.status(500).json({ ok: false });
    }
}));
routes.post("/logout", (req, res) => {
    if (!req.body)
        return res.sendStatus(500);
    req.session.destroy((err) => {
        if (err) {
            return res.status(403).json({ error: `${err.message}` });
        }
        else {
            res.clearCookie("connect.sid");
            return res.status(201).json({ ok: true });
        }
    });
});
routes.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { login, password } = req.body;
        const collection = mongoClient
            .db("test")
            .collection("users");
        const candidate = yield collection.findOne({ name: login });
        if (candidate) {
            return res.status(403).json({ ok: false, error: "isExist" });
        }
        const hashPass = bcrypt.hashSync(password, 7);
        const newUser = { name: login, pass: hashPass };
        yield collection.insertOne(newUser);
        return res.status(201).json({ ok: true });
    }
    catch (error) {
        return res.status(500).json({ ok: false });
    }
}));
// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoClient.close();
    console.log("EXIT");
    process.exit();
}));
export { routes as v1Mongo };
