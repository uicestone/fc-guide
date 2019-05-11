import cors from "cors";
import methodOverride from "method-override";
import authenticate from "../middlewares/authenticate";
import castEmbedded from "../middlewares/castEmbedded";
import Auth from "./auth";
import Booking from "./booking";
import Config from "./config";

export default (app, router) => {
  // register routes

  [Auth, Booking, Config].forEach(R => {
    router = R(router);
  });

  router.get("/", (req, res) => {
    res.send("Welcome!");
  });

  app.use(
    "/api",
    cors({
      exposedHeaders: [
        "content-range",
        "accept-range",
        "items-total",
        "items-start",
        "items-end"
      ]
    }),
    methodOverride(),
    authenticate,
    castEmbedded,
    router
  );
};
