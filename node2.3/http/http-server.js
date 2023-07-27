const http = require("http");
const fs = require("fs");

const PORT = 3000;
const messageArr = []; // масив повідомлень
const timeArr = []; // масив збережених проміжків часу

const server = http.createServer(async (req, res) => {
  const { method, url, headers } = req;
  const startTime = Date.now(); // Початковий час обробки запиту

  // Обробка запиту від клієнта - для отримання коду сторінки
  if (method === "GET") {
    let data;
    let status;
    try {
      data = await fs.promises.readFile("index.html", "utf8");
      status = 200;
    } catch {
      data = "page not found";
      type = "text/html";
      status = 404;
    } finally {
      res.writeHead(status, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  } else if (method === "POST" && url === "/echo") {
    let data = "";

    // Обробка даних, отриманих від клієнта
    req.on("data", (chunk) => {
      data += chunk;
    });

    // Обробка завершення передачі даних від клієнта
    req.on("end", () => {
      // Відправка даних назад клієнту
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      // додавання повідомлення і часу обробки до відповідних масивів
      messageArr.push(data);
      timeArr.push(totalTime);

      res.writeHead(200, { "Content-Type": "text/html" });

      // Формуємо об'єкт відповіді, який містить масиви повідомлень і сумарного часу
      let responseData =
        "<h3>Чат</h3><table><tr><th>Повідомлення</th><th>Час</th></tr>";
      for (let i = 0; i < messageArr.length; i++) {
        responseData += `<tr><td class="row1">${messageArr[i]}</td><td class="row2">${timeArr[i]}ms</td></tr>`;
      }
      res.write(responseData);
      res.end();
      console.log(
        `IP клієнта: ${req.connection.remoteAddress}, Час виконання: ${totalTime}ms, Текст: ${data}`
      );
    });
  } else {
    // Обробка невідомих URL або методів запитів
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }

  // Обробка закриття сесії з клієнтом
  // req.on("close", () => {
  //   console.log(
  //     `Закриття сесії з клієнтом - IP: ${req.connection.remoteAddress}`
  //   );
  // });
});

// Запускаємо сервер
server.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
