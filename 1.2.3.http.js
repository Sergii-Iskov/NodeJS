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

// let contents = `GET /sum?nums=1,2,3,4 HTTP/1.1
// Host: shpp.me
// Accept: image/gif, image/jpeg, */*
// Accept-Language: en-us
// Accept-Encoding: gzip, deflate
// User-Agent: Mozilla/4.0

// `;

http = parseTcpStringAsHttpRequest(contents);
processHttpRequest(http.method, http.uri, http.headers, http.body);

// node tester.js 3 1.2.3.http.js
