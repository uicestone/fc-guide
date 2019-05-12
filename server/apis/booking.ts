import paginatify from "../middlewares/paginatify";
import handleAsyncErrors from "../utils/handleAsyncErrors";
import parseSortString from "../utils/parseSortString";
import Booking from "../models/booking";
import HttpError from "../utils/HttpError";
import User from "../models/user";
import { sendPaymentEmail } from "../services/sendEmail";

export default router => {
  // Booking CURD
  router
    .route("/booking")

    // create a booking
    .post(
      handleAsyncErrors(async (req, res) => {
        const booking = new Booking(req.body);

        if (!req.body.userEmail) {
          throw new HttpError(400, "Missing user email.");
        }

        const user = await User.findOneAndUpdate(
          { email: req.body.userEmail },
          { email: req.body.userEmail },
          {
            new: true,
            upsert: true,
            //@ts-ignore
            useFindAndModify: false
          }
        );

        booking.user = user;

        await booking.save();

        sendPaymentEmail(booking);

        res.json(booking);
      })
    )

    // get all the bookings
    .get(
      paginatify,
      handleAsyncErrors(async (req, res) => {
        const { limit, skip } = req.pagination;
        const query = Booking.find();
        const sort = parseSortString(req.query.order) || {
          createdAt: -1
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
    .route("/booking/:bookingId")

    .all(
      handleAsyncErrors(async (req, res, next) => {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
          throw new HttpError(
            404,
            `Booking not found: ${req.params.bookingId}`
          );
        }
        req.item = booking;
        next();
      })
    )

    // get the booking with that id
    .get(
      handleAsyncErrors(async (req, res) => {
        const booking = req.item;
        res.json(booking);
      })
    )

    .patch(
      handleAsyncErrors(async (req, res) => {
        if (req.user.roles.indexOf("admin") === -1) {
          throw new HttpError(403);
        }
        const booking = req.item;
        booking.set(req.body);
        await booking.save();
        res.json(booking);
      })
    )

    // delete the booking with this id
    .delete(
      handleAsyncErrors(async (req, res) => {
        if (req.user.roles.indexOf("admin") === -1) {
          throw new HttpError(403);
        }
        const booking = req.item;
        await booking.remove();
        res.end();
      })
    );

  router
    .route("/availability")

    // get availability of dates
    .get(
      handleAsyncErrors(async (req, res) => {
        const availability = {
          full: [],
          am: [],
          pm: []
        };
        // Booking.aggregate([
        //   { $match: { date: { $gte: "2019-05", $lt: "2019-06" } } },
        //   {$group:{_id:1, }}
        // ]);
      })
    );

  return router;
};
