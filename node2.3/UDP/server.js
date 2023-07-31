const UDP = require("dgram");

const server = UDP.createSocket("udp4");

const port = 2222;

server.on("listening", () => {
  // Server address it’s using to listen
  const address = server.address();

  console.log(
    "Listining to ",
    "Address: ",
    address.address,
    "Port: ",
    address.port
  );
});

server.on("message", (message, info) => {
  console.log("Message : ", message.toString(), new Date());
  message += " (echo)";

  //sending back response to client
  server.send(message, info.port, info.address, (err) => {
    if (err) {
      console.error("Failed to send response !! ");
    } else {
      console.log("Response send Successfully. ");
    }
  });
});

// emits when any error occurs
server.on("error", (error) => {
  console.log("Error: " + error);
  server.close();
});

server.bind(port);
