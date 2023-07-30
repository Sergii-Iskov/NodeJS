const net = require("net");
const port = 3000;
const host = "127.0.0.1";

const server = net.createServer();
server.listen(port, host, () => {
  console.log(`TCP Server is running on port ${port}`);
});

let clients = [];
server.on("connection", (sock) => {
  sock.setKeepAlive(false);
  console.log(`CONNECTED: ${sock.remoteAddress}:${sock.remotePort}`);

  let startTime = null;
  clients.push(sock);

  sock.on("data", (data) => {
    if (!startTime) {
      startTime = Date.now();
    }

    console.log("DATA " + sock.remoteAddress + ": " + data);
    // Calculate and send the time taken
    const totalTime = Date.now() - startTime;
    // Write the data back to all the connected, the client will receive it as data from the server
    clients.forEach((elem, index, array) =>
      elem.write(`${sock.remoteAddress}:${sock.remotePort} said ${data}`)
    );
  });

  // Add a 'close' event handler to this instance of socket
  sock.on("close", (data) => {
    let index = clients.findIndex((o) => {
      return (
        o.remoteAddress === sock.remoteAddress &&
        o.remotePort === sock.remotePort
      );
    });
    if (index !== -1) clients.splice(index, 1);
    console.log(`CLOSED: ${sock.remoteAddress}:${sock.remotePort}`);
  });

  sock.on("end", () => {
    console.log(
      `Client disconnected: ${sock.remoteAddress}:${sock.remotePort}`
    );
  });

  sock.on("error", (err) => console.error("An error occurred: ", err.message));
});

server.on("close", () => {
  console.log("Server closed");
});
