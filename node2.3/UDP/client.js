const UDP = require("dgram");

const client = UDP.createSocket("udp4");

const port = 2222;
const hostname = "localhost";
let startTime = null;

client.on("message", (message, info) => {
  // get the information about server address, port, and size of packet received.
  console.log(
    "Address: ",
    info.address,
    "Port: ",
    info.port,
    "Size: ",
    info.size
  );

  const totalTime = Date.now() - startTime;

  //read message from server
  console.log(
    "Message from server : ",
    message.toString(),
    ". Total time : ",
    totalTime,
    "ms"
  );
});

const packet = Buffer.from("This is a message from client");

client.send(packet, port, hostname, (err) => {
  startTime = Date.now();

  if (err) {
    console.error("Failed to send packet !!");
  } else {
    console.log("Packet send !!");
  }
});
