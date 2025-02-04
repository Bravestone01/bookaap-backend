// creating make app using express
import express from "express";
import cors from "cors";
const app = express();
app.use (cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}
));

app.use(express.json());

// importing books router in app file

import bookRouter from "./routes/book.routes.js";

app.use("/api/v1/books", bookRouter);

// http://localhost:8000/api/v1/books my url

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

export {app};














