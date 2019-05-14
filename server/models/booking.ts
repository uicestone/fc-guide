import mongoose from "mongoose";
import updateTimes from "./plugins/updateTimes";
import autoPopulate from "./plugins/autoPopulate";
import User, { IUser } from "./user";

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: User },
  date: String,
  ampm: String,
  membersCount: Number,
  status: String,
  price: Number,
  payment: Object
});

bookingSchema.plugin(autoPopulate, ["user"]);
bookingSchema.plugin(updateTimes);

bookingSchema.set("toJSON", {
  getters: true,
  transform: function(doc, ret, options) {
    delete ret._id;
  }
});

export interface IBooking extends mongoose.Document {
  user: IUser;
  date: string;
  ampm: string;
  membersCount: number;
  status: string;
  price: number;
  payment?: Object;
}

export default mongoose.model<IBooking>("booking", bookingSchema);
