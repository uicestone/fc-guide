import HttpError from "./HttpError";

try {
  throw new HttpError(404);
} catch (err) {
  console.log(err.message, err instanceof HttpError);
}
