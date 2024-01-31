var _a;
import { app } from "./app.js"; // npm run start
const PORT = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : "3000"); // http://localhost:3000/
app.listen(PORT, (error) => {
    if (error) {
        console.log("We have a problem ", error);
        return;
    }
    console.log(`listening on port ${PORT}`);
});
