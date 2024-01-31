import { app } from "./app.js"; // npm run start
const PORT: number = parseInt(process.env.PORT ?? "3000"); // http://localhost:3000/
app.listen(PORT, (error?: Error) => {
  if (error) {
    console.log("We have a problem ", error);
    return;
  }
  console.log(`listening on port ${PORT}`);
});
