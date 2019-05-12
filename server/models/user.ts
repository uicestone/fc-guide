import mongoose from "mongoose";
import updateTimes from "./plugins/updateTimes";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: { type: String, select: false },
  token: { type: String, select: false },
  roles: { type: [String], default: ["customer"] },
  name: String,
  gender: String,
  mobile: String,
  avatarUri: String
});

userSchema.index({ email: 1 }, { unique: true });

// userSchema.virtual("avatarUrl").get(function(req) {
//   if (!this.avatarUri) return null;
//   return (process.env.CDN_URL || req.baseUrl )+ this.avatarUri;
// });

userSchema.plugin(updateTimes);

userSchema.set("toJSON", {
  getters: true,
  transform: function(doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  }
});

export interface IUser extends mongoose.Document {
  email: string;
  password?: string;
  token?: string;
  roles: [string];
  name?: string;
  gender: string;
  mobile?: string;
  avatarUri?: string;
}

export default mongoose.model<IUser>("User", userSchema);
