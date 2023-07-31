const net = require("net");

const server = net.createServer((socket) => {
  const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`Client connected: ${clientAddress}`);

  socket.on("data", (data) => {
    const receivedData = data.toString().trim();

    console.log(
      `Received from ${clientAddress}: ${receivedData}, ${new Date()})`
    );

    // Echo back the received data
    socket.write(receivedData);
  });

  socket.on("end", () => {
    console.log(`Client disconnected: ${clientAddress}`);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

server.on("close", () => {
  console.log("Server closed");
});
