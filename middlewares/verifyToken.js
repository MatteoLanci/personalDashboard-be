const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send({
      statuCode: 401,
      message: "Access forbidden. Token not found",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    next();
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Token not valid or expired",
    });
  }
};

module.exports = verifyToken;
