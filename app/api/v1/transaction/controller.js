const { StatusCodes } = require("http-status-codes");
const CustomAPI = require("../../../errors");

const Transaction = require("./model");
const Event = require("../event/model");

const getAll = async (req, res, next) => {
  try {
    const data = await Transaction.find().populate({
      path: "participant",
      select: "_id firstName lastName email role",
      model: "Participant",
    });

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { id: transactionId } = req.params;

    const data = await Transaction.findOne({ _id: transactionId }).populate({
      path: "participant",
      select: "_id firstName lastName email role",
      model: "Participant",
    });

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getOne,
};
