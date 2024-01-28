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
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { DB_PASSWORD, SESSION_PASSWORD } from "../config/secret.js";
import session from "express-session";
import sessionFileStore from "session-file-store";
const FileStore = sessionFileStore(session);
const routes = express.Router();
routes.use(session({
    secret: SESSION_PASSWORD,
    resave: true,
    saveUninitialized: false,
    store: new FileStore(),
    cookie: { maxAge: 3600000, secure: false, httpOnly: true },
}));
const taskSchema = new mongoose.Schema({
    id: {
        type: Number,
        require: [true, "Task description is required"],
    },
    name: {
        type: String,
        require: [true, "Task description is required"],
    },
    text: {
        type: String,
        require: [true, "Task description is required"],
    },
    checked: {
        type: Boolean,
        default: false,
    },
});
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Task description is required"],
    },
    password: {
        type: String,
        require: [true, "Task description is required"],
    },
});
const Task = mongoose.model("Task", taskSchema);
const User = mongoose.model("User", userSchema);
const URI = `mongodb+srv://sergaiskov:${DB_PASSWORD}@cluster0.yssjlla.mongodb.net/?retryWrites=true&w=majority`;
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.connect(URI);
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
            userTASKS.items = yield Task.find({ name: user });
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
        yield Task.create({
            id: idMess,
            name: userName,
            text: req.body.text,
        });
        return res.status(201).json({ id: idMess });
    }
    catch (error) {
        return res.status(500).json({ ok: false });
    }
}));
routes.put("/items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idMess = req.body.id;
        const { text, checked } = req.body;
        yield Task.findOneAndUpdate({ id: idMess }, { text: req.body.text, checked: req.body.checked }, { new: true });
        return res.json({ ok: true });
    }
    catch (error) {
        return res.status(500).json({ ok: false });
    }
}));
routes.delete("/items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idMess = req.body.id;
        yield Task.deleteOne({ id: idMess });
        return res.json({ ok: true });
    }
    catch (error) {
        return res.status(500).json({ ok: false });
    }
}));
routes.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { login, pass } = req.body;
        const user = (yield User.findOne({ name: login }));
        if (bcrypt.compareSync(pass, user.password)) {
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
        const { login, pass } = req.body;
        const candidate = yield User.findOne({ name: login });
        if (candidate) {
            return res.status(403).json({ ok: false, error: "isExist" });
        }
        const hashPass = bcrypt.hashSync(pass, 7);
        yield User.create({ name: login, password: hashPass });
        return res.status(201).json({ ok: true });
    }
    catch (error) {
        return res.status(500).json({ ok: false });
    }
}));
// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose.disconnect();
    console.log("Приложение завершило работу");
    process.exit();
}));
export { routes as v1Mongoose };