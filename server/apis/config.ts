import paginatify from "../middlewares/paginatify";
import handleAsyncErrors from "../utils/handleAsyncErrors";
import parseSortString from "../utils/parseSortString";
import Config from "../models/config";
import HttpError from "../utils/HttpError";
import { Types } from "mongoose";

export default router => {
  // Config CURD
  router
    .route("/config")

    // create a config
    .post(
      handleAsyncErrors(async (req, res) => {
        const config = new Config(req.body);
        await config.save();
        res.json(config);
      })
    )

    // get all the configs
    .get(
      paginatify,
      handleAsyncErrors(async (req, res) => {
        const { limit, skip } = req.pagination;
        const query = Config.find();
        const sort = parseSortString(req.query.order) || {
          goodsType: 1,
          name: 1
        };

        let total = await query.countDocuments();
        const page = await query
          .find()
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .exec();

        if (skip + page.length > total) {
          total = skip + page.length;
        }

        res.paginatify(limit, skip, total).json(page);
      })
    );

  router
    .route("/config/:configId")

    .all(
      handleAsyncErrors(async (req, res, next) => {
        const where = Types.ObjectId.isValid(req.params.configId)
          ? { _id: req.params.configId }
          : { key: req.params.configId };
        const config = await Config.findOne(where);
        if (!config) {
          throw new HttpError(404, `Config not found: ${req.params.configId}`);
        }
        req.item = config;
        next();
      })
    )

    // get the config with that id
    .get(
      handleAsyncErrors(async (req, res) => {
        const config = req.item;
        res.json(config);
      })
    )

    .patch(
      handleAsyncErrors(async (req, res) => {
        if (req.user.roles.indexOf("admin") === -1) {
          throw new HttpError(403);
        }
        const config = req.item;
        config.set(req.body);
        await config.save();
        res.json(config);
      })
    )

    // delete the config with this id
    .delete(
      handleAsyncErrors(async (req, res) => {
        if (req.user.roles.indexOf("admin") === -1) {
          throw new HttpError(403);
        }
        const config = req.item;
        await config.remove();
        res.end();
      })
    );

  return router;
};
