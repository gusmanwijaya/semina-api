const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api-error");

class Forbidden extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = Forbidden;
