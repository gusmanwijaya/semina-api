const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (error, req, res, next) => {
  let customError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || "Something went wrong try again later",
  };

  if (error.name === "ValidationError") {
    customError.statusCode = 400;
    customError.message = Object.values(error.errors)
      .map((value) => value.message)
      .join(", ");
  }

  if (error.code && error.code === 11000) {
    customError.statusCode = 400;
    customError.message = `Duplicate value entered for ${Object.keys(
      error.keyValue
    )} field, please choose another value`;
  }

  if (error.name === "CastError") {
    customError.statusCode = 404;
    customError.message = `No item found with id : ${error.value}`;
  }

  return res.status(customError.statusCode).json({
    statusCode: customError.statusCode,
    message: customError.message,
  });
};

module.exports = errorHandlerMiddleware;
