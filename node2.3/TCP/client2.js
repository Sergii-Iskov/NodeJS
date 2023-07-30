const net = require("net");
const client = new net.Socket();
const port = 3000;
const host = "127.0.0.1";

client.connect(port, host, () => {
  console.log("Connected");
  let startTime = Date.now();
  client.write(`Hello From Client ${client.address().address}`);

  client.on("data", (data) => {
    const totalTime = Date.now() - startTime;
    console.log(`Server Says : ${data}. Total time taken: ${totalTime}ms`);
    // client.end();
  });

  client.on("close", () => {
    console.log("Connection closed");
  });
});
