import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import env from "dotenv";
import http from "http";
import handleError from "./utils/handleError";
import applyRoutes from "./apis";

const app = express();
const router = express.Router();
const httpServer = http.createServer(app);

env.config();

console.log(`[SYS] System time is ${new Date()}`);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(bodyParser.json({ limit: "4mb" }));
applyRoutes(app, router);

app.use(handleError);

app.set("trust proxy", "loopback");

const port = process.env.PORT_HTTP;

httpServer.listen(port, () => {
  console.log(`[SYS] HTTP server listening port: ${port}.`);
});
