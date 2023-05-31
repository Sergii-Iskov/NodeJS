const { default: test } = require("node:test");

function readHttpLikeInput() {
  var fs = require("fs");
  var res = "";
  var buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);
  let was10 = 0;
  for (;;) {
    try {
      fs.readSync(0 /*stdin fd*/, buffer, 0, 1);
    } catch (e) {
      break; /* windows */
    }
    if (buffer[0] === 10 || buffer[0] === 13) {
      if (was10 > 10) break;
      was10++;
    } else was10 = 0;
    res += new String(buffer);
  }

  return res;
}

let contents = readHttpLikeInput();

function outputHttpResponse(statusCode, statusMessage, headers, body) {
  console.log(
    `HTTP/1.1 ` + statusCode + statusMessage + `\n` + headers + `\n` + body
  );
}

function processHttpRequest($method, $uri, $headers, $body) {
  // ... проанализировать входящие данные, вычислить результат
  // и специальной командой красиво вывести ответ
  let statusCode,
    statusMessage,
    headers = "Date: " + new Date() + `\n`,
    body;

  if ($method == "GET") {
    if (/sum\?nums=((\d+)\,)+/.test($uri)) {
      statusCode = 200;
      statusMessage = ` OK`;
      body = $uri
        .split("=")[1]
        .split(",")
        .reduce((sum, current) => sum + +current, 0);
    } else if (/sum\?/.test($uri)) {
      statusCode = 400;
      statusMessage = ` Bad Request`;
      body = "not found";
    } else {
      statusCode = 404;
      statusMessage = ` Not Found`;
      body = "not found";
    }
  } else if ($method == "POST") {
    if (
      $uri == "/api/checkLoginAndPassword" &&
      $headers["Content-Type"] == "application/x-www-form-urlencoded"
    ) {
      statusCode = 200;
      statusMessage = ` OK`;

      let logAndPass = $body.split("&");
      let login = logAndPass[0].split("=")[1];
      const password = logAndPass[1].split("=")[1];
      try {
        const savedLogAndPass = require("fs").readFileSync(
          "passwords.txt",
          "utf8"
        );
        if (savedLogAndPass.includes(login + ":" + password)) {
          body = `<h1 style="color:green">FOUND</h1>`;
        } else {
          statusCode = 401;
          statusMessage = " Unauthorized";
          body = "You must authenticate itself to get the requested response";
        }
      } catch (err) {
        console.error(err);
        statusCode = 500;
        statusMessage = " Internal Server Error";
        body = "File with login and password was not found";
      }
    }
  } else {
    statusCode = 400;
    statusMessage = ` Bad Request`;
    body = "not found";
  }

  for (const key in $headers) {
    if (Object.hasOwnProperty.call($headers, key)) {
      headers += key + `: ` + `${$headers[key]}` + `\n`;
    }
  }

  outputHttpResponse(statusCode, statusMessage, headers, body);
}

function parseTcpStringAsHttpRequest($string) {
  let arr = $string.split("\n");
  let firstLine = arr[0].split(" ");
  let bodyElement = "";
  let headersOb = {};
  arr.splice(0, 1);
  arr.forEach((element) => {
    let line = element.split(":");
    if (line.length == 2) {
      headersOb[line[0]] = line[1].trim();
    }
    if (element.trim().length > 0 && line.length == 1) {
      bodyElement += line[0];
    }
  });

  return {
    method: firstLine[0],
    uri: firstLine[1],
    headers: headersOb,
    body: bodyElement,
  };
}

// let contents = `POST /api/checkLoginAndPassword HTTP/1.1
// Accept: */*
// Content-Type: application/x-www-form-urlencoded
// User-Agent: Mozilla/4.0
// Content-Length: 35

// login=student&password=12345
// `;

http = parseTcpStringAsHttpRequest(contents);
processHttpRequest(http.method, http.uri, http.headers, http.body);

// node tester.js 4 1.2.4.forms.js
