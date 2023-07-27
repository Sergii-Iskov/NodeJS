const net = require("net");

const server = net.createServer((socket) => {
  const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`Client connected: ${clientAddress}`);

  let startTime = null;
  let clientData = null;

  socket.on("data", (data) => {
    const receivedData = data.toString().trim();

    if (!startTime) {
      startTime = Date.now();
    }

    if (!clientData) {
      clientData = receivedData;
    }

    console.log(`Received from ${clientAddress}: ${receivedData}`);

    // Echo back the received data
    socket.write(receivedData);

    // Calculate and send the time taken
    const totalTime = Date.now() - startTime;
    socket.write(`\nTotal time taken: ${totalTime}ms\n`);
  });

  socket.on("end", () => {
    console.log(`Client disconnected: ${clientAddress}`);
    console.log(`Client data: ${clientData}`);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

server.on("close", () => {
  console.log("Server closed");
});
