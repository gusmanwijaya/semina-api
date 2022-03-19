const jwt = require("jsonwebtoken");
const config = require("../config");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, config.jwtKey);
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, config.jwtKey);

module.exports = {
  createJWT,
  isTokenValid,
};
