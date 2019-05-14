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

const mongooseUrl: string = process.env.MONGODB_URL || process.exit();
const portHttp: string = process.env.PORT_HTTP || process.exit();

console.log(`[SYS] System time is ${new Date()}`);

mongoose.connect(mongooseUrl, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(handleError);
app.use(bodyParser.json({ limit: "4mb" }));
app.use("/", express.static(`${__dirname}/../web`));
app.set("trust proxy", "loopback");
applyRoutes(app, router);

httpServer.listen(portHttp, () => {
  console.log(`[SYS] HTTP server listening port: ${portHttp}.`);
});
