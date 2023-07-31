const net = require("net");
const port = 3000;
const host = "127.0.0.1";

const server = net.createServer();
server.listen(port, host, () => {
  console.log(`TCP Server is running on port ${port}`);
});

let clients = [];
server.on("connection", (sock) => {
  console.log(`CONNECTED: ${sock.remoteAddress}:${sock.remotePort}`);

  clients.push(sock);

  sock.on("data", (data) => {
    console.log(
      `DATA ${sock.remoteAddress}:${data}, ${new Date()}. Received ${
        sock.bytesRead
      } bytes`
    );
    // Calculate and send the time taken
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

// emits when any error occurs
server.on("error", (error) => {
  log("tcp_server", "error", error);
  server.close();
});

server.on("close", () => {
  console.log("Server closed");
});
