const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};
