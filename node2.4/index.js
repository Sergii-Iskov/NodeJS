import { app } from "./app.js"; // npm run server

const PORT = process.env.PORT ?? 3000; // http://localhost:3000/

app.listen(PORT, (error) => {
  if (error) {
    console.log("We have a problem ", error);
    return;
  }
  console.log(`listening on port ${PORT}`);
});
