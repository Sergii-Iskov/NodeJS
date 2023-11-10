// save in file
import express from "express";
import fs from "fs";

const routes = express.Router();

routes.get("/items", (req, res) => {
  const content = fs.readFileSync("items.json", "utf8");
  const TASKS = JSON.parse(content);
  console.log(TASKS);
  res.json(TASKS);
});

routes.post("/items", (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const idMess = Date.now();
  const newText = req.body.text;
  let newItem = { id: idMess, text: newText, checked: false };

  const content = fs.readFileSync("items.json", "utf8");
  const TASKS = JSON.parse(content);

  TASKS.items.push(newItem);
  let data = JSON.stringify(TASKS);
  fs.writeFileSync("items.json", data);
  console.log(TASKS);

  res.json({ id: idMess });
});

routes.put("/items", (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const idMess = req.body.id;
  let changeItem;

  const content = fs.readFileSync("items.json", "utf8");
  const TASKS = JSON.parse(content);
  for (var i = 0; i < TASKS.items.length; i++) {
    if (TASKS.items[i].id == idMess) {
      changeItem = TASKS.items[i];
      break;
    }
  }

  if (changeItem) {
    changeItem.text = req.body.text;
    changeItem.checked = req.body.checked;
    let data = JSON.stringify(TASKS);
    fs.writeFileSync("items.json", data);
    console.log(TASKS);
    res.json({ ok: true });
  } else {
    res.status(404).json({ ok: false });
  }
});

routes.delete("/items", (req, res) => {
  const idMess = req.body.id;
  let index = -1;

  const content = fs.readFileSync("items.json", "utf8");
  const TASKS = JSON.parse(content);
  for (var i = 0; i < TASKS.items.length; i++) {
    if (TASKS.items[i].id == idMess) {
      index = i;
      break;
    }
  }

  if (index > -1) {
    TASKS.items.splice(index, 1)[0];
    let data = JSON.stringify(TASKS);
    fs.writeFileSync("items.json", data);
    console.log(TASKS);
    res.json({ ok: true });
  } else {
    res.status(404).json({ ok: false });
  }
});

export { routes as v1Routes };
