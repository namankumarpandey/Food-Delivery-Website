const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const fetch = (req, res, next) => {
  // get the user from the jwt token and add id to req object
  try {
    console.log("HEADERS:", req.headers);
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).send({ error: "No token, access denied" });
    }

    // ✅ Remove "Bearer " from token
    const token = authHeader.replace("Bearer ", "");

    const data = jwt.verify(token, jwtSecret);

    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Invalid token" });
  }
};
module.exports = fetch;
