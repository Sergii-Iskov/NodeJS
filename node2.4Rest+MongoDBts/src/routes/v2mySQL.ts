import express, { Router, Request, Response } from "express";
import mySQL, { ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";
import session, { SessionOptions } from "express-session";
import sessionFileStore from "session-file-store";
import { mySQL_PASSWORD, SESSION_PASSWORD } from "../config/secret.js";
import { User } from "../models/mysql.js";

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

const connectionConfig = {
  host: "localhost",
  user: "root",
  database: "taskAndUser",
  password: mySQL_PASSWORD,
};

// Create DATABASE and TABLEs IF NOT EXISTS
const conn = mySQL.createConnection(connectionConfig);

(() => {
  conn.query("CREATE DATABASE IF NOT EXISTS taskAndUser2;", (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`База даних успішно перевірена/створена.`);
    }
  });
  conn.query("USE taskAndUser2;", (error) => {
    if (error) {
      console.log(error);
    }
  });
  conn.query(
    `CREATE TABLE IF NOT EXISTS users (
                            id integer PRIMARY KEY AUTO_INCREMENT,
                            name varchar(50) NOT NULL UNIQUE,
                            pass varchar(250) NOT NULL
                        );`,
    (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Таблиця users успішно перевірена/створена.`);
      }
    }
  );
  conn.query(
    `CREATE TABLE IF NOT EXISTS tasks (
                            id integer PRIMARY KEY AUTO_INCREMENT,
                            name varchar(50) NOT NULL,
                            text varchar(250) NOT NULL,
                            checked boolean,
                            CONSTRAINT tasks_users_fk
                            FOREIGN KEY(name) REFERENCES users(name)
                        );`,
    (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Таблиця tasks успішно перевірена/створена.`);
      }
    }
  );
})();

const pool = mySQL.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "taskAndUser2",
  password: mySQL_PASSWORD,
});

routes.post("", (req: Request, res: Response) => {
  switch (req.query.action) {
    case "login": {
      login(req, res);
      break;
    }
    case "logout": {
      logout(req, res);
      break;
    }
    case "register": {
      register(req, res);
      break;
    }
    case "getItems": {
      getItems(req, res);
      break;
    }
    case "deleteItem": {
      deleteItem(req, res);
      break;
    }
    case "addItem": {
      addItem(req, res);
      break;
    }
    case "editItem": {
      editItem(req, res);
      break;
    }
  }
});

function getItems(req: Request, res: Response) {
  const user: string | undefined = req.session.login;
  if (user) {
    const sql: string = `SELECT * FROM tasks WHERE name = ?;`;
    const filter = [user];

    pool.query(sql, filter, (error, results) => {
      if (error) return res.status(500).json({ ok: false });
      console.log(results);
      return res.json({ items: results });
    });
  } else {
    return res.status(400).json({ error: "forbidden" });
  }
}

function addItem(req: Request, res: Response) {
  const sql: string = `INSERT INTO tasks(name, text, checked) 
                        VALUE (?, ?, ?);`;
  const filter = [req.session.login, req.body.text, false];

  pool.query<ResultSetHeader>(sql, filter, (error, results) => {
    if (error)
      return res.status(500).json({ ok: false, error: "Something wrong" });
    console.log(results);
    return res.status(201).json({ id: results.insertId });
  });
}

function editItem(req: Request, res: Response) {
  const sql: string = `UPDATE tasks 
                        SET text = ?, checked = ? 
                        WHERE id = ?;`;
  const filter = [req.body.text, req.body.checked, req.body.id];

  pool.query(sql, filter, (error, results) => {
    if (error)
      return res.status(500).json({ ok: false, error: "Something wrong" });
    return res.json({ ok: true });
  });
}

function deleteItem(req: Request, res: Response) {
  const sql: string = `DELETE FROM tasks WHERE id = ?;`;
  const filter = [req.body.id];

  pool.query(sql, filter, (error, results) => {
    if (error)
      return res.status(500).json({ ok: false, error: "Something wrong" });
    return res.json({ ok: true });
  });
}

function login(req: Request, res: Response) {
  const sql = `SELECT * FROM users WHERE name = ?;`;
  const filter = [req.body.login];

  pool.query<User[]>(sql, filter, (error, results) => {
    if (error)
      return res.status(500).json({ ok: false, error: "Something wrong" });

    if (results[0] && bcrypt.compareSync(req.body.pass, results[0].pass)) {
      req.session.login = results[0].name;
      return res.status(201).json({ ok: true });
    } else {
      return res.status(400).json({ ok: false, error: "not found" });
    }
  });
}

function logout(req: Request, res: Response) {
  if (!req.body)
    return res.sendStatus(500).json({ ok: false, error: "Something wrong" });

  req.session.destroy((err) => {
    if (err) {
      return res.status(400).json({ error: `${err.message}` });
    } else {
      res.clearCookie("connect.sid");
      return res.status(201).json({ ok: true });
    }
  });
}

function register(req: Request, res: Response) {
  const { login, pass }: { login: string; pass: string } = req.body;
  const sql = `SELECT * FROM users WHERE name = ?;`;
  const filter = [login];

  pool.query<User[]>(sql, filter, (error, results) => {
    if (error) return res.status(500).json({ ok: false });

    if (results[0]) {
      return res.status(400).json({ ok: false, error: "isExist" });
    }

    const hashPass: string = bcrypt.hashSync(pass, 7);
    const sql2: string = `INSERT INTO users(name, pass) 
                        VALUE (?, ?);`;
    const filter2 = [login, hashPass];

    pool.query<ResultSetHeader>(sql2, filter2, (error, results2) => {
      if (error)
        return res.status(500).json({ ok: false, error: "Something wrong" });
      return res.status(201).json({ ok: true });
    });
  });
}

// check for program EXIT (ctrl-c)
process.on("SIGINT", async () => {
  pool.end((error) => {
    if (error) {
      console.log(error.message);
    }
    console.log("пул закрито");
  });
  console.log("Додаток завершив роботу");
  process.exit();
});

export { routes as v2 };
