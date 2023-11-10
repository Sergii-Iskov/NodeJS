// save in memory
import express from "express";

const routes = express.Router();

// create application/json parser
// const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

const TASKS = {
  items: [],
};

routes.get("/items", (req, res) => {
  console.log(TASKS);
  res.json(TASKS);
});

routes.post("/items", (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const idMess = Date.now();
  const newText = req.body.text;
  let newItem = { id: idMess, text: newText, checked: false };

  TASKS.items.push(newItem);
  console.log(TASKS);

  res.json({ id: idMess });
});

routes.put("/items", (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const idMess = req.body.id;
  let changeItem;

  for (var i = 0; i < TASKS.items.length; i++) {
    if (TASKS.items[i].id == idMess) {
      changeItem = TASKS.items[i];
      break;
    }
  }

  if (changeItem) {
    changeItem.text = req.body.text;
    changeItem.checked = req.body.checked;
    // data = JSON.stringify(TASKS);
    // fs.writeFileSync("items.js", data);
    console.log(TASKS);
    res.json({ ok: true });
  } else {
    res.status(404).json({ ok: false });
  }
});

routes.delete("/items", (req, res) => {
  const idMess = req.body.id;
  let index = -1;

  for (var i = 0; i < TASKS.items.length; i++) {
    if (TASKS.items[i].id == idMess) {
      index = i;
      break;
    }
  }

  if (index > -1) {
    TASKS.items.splice(index, 1)[0];
    console.log(TASKS);
    res.json({ ok: true });
  } else {
    res.status(404).json({ ok: false });
  }
});

export { routes as v1Routes };
