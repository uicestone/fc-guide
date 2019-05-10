import { MongoError } from "mongodb";
import HttpError from "./HttpError";

export default (err: Error, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
  } else if (err instanceof MongoError && err.code === 11000) {
    const match = err.message.match(
      /collection: .*?\.(.*?) index: (.*?) dup key: { : (.*?) }$/
    );
    res.status(409).json({
      message: `Duplicated "${match[1]}" "${match[2].replace(
        /_\d+_?/g,
        ", "
      )}": ${match[3]}`
    });
  } else {
    console.error(JSON.stringify(err), "\n[Stack]", err.stack);
    res.status(500).send("Internal server error.");
  }
};
