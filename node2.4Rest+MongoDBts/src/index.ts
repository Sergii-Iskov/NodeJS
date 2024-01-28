import { app } from "./app.js"; // npm run build
const PORT: number = parseInt(process.env.PORT ?? "3000"); // http://localhost:3000/
app.listen(PORT, (error?: Error) => {
  if (error) {
    console.log("We have a problem ", error);
    return;
  }
  console.log(`listening on port ${PORT}`);
});

// import { app } from "./app.js"; // npm run server

// // const PORT: number = 3000; // http://localhost:3000/
// const PORT: string | number = process.env.PORT || 3000; // http://localhost:3000/

// app.listen(PORT, () => {
//   try {
//     console.log(`listening on port ${PORT}`);
//   } catch (error) {
//     console.log("We have a problem ", error);
//   }
// });
