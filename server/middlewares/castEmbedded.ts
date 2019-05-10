export default async function(req, res, next) {
  for (let key in req.body) {
    if (req.body[key] instanceof Object && req.body[key].id) {
      req.body[key] = req.body[key].id;
    }
  }
  next();
}
