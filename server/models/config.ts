import mongoose from "mongoose";
import updateTimes from "./plugins/updateTimes";

const Schema = mongoose.Schema;

const configSchema = new Schema({
  key: String,
  value: Schema.Types.Mixed
});

configSchema.plugin(updateTimes);

configSchema.set("toJSON", {
  getters: true,
  transform: function(doc, ret, options) {
    delete ret._id;
  }
});

configSchema.statics.get = async function(key, defaults) {
  const doc = await this.findOne({ key });
  return doc ? doc.value : defaults;
};

export default mongoose.model("Config", configSchema);
