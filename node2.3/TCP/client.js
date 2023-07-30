const net = require("net");

const client = new net.Socket();

const host = "localhost";
const port = 3000;

client.connect(port, host, () => {
  console.log("Connected to server");

  const message = "Hello, server!";
  console.log(`Sending to server: ${message}`);

  let startTime = Date.now();

  client.write(message);

  client.on("data", (data) => {
    const response = data.toString().trim();
    const totalTime = Date.now() - startTime;
    console.log(`Received from server: ${response}`);
    console.log(`Total time taken: ${totalTime}ms`);
    client.end();
  });

  client.on("close", () => {
    console.log("Connection closed");
  });
});
