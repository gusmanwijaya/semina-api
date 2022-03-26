const { StatusCodes } = require("http-status-codes");
const CustomAPI = require("../../../errors");
const moment = require("moment");

const Transaction = require("./model");
const Event = require("../event/model");
const Payment = require("../payment/model");

const getAll = async (req, res, next) => {
  try {
    const {
      limit = 5,
      page = 1,
      event,
      keyword,
      startDate,
      endDate,
    } = req.query;
    const user = req.user._id;

    let condition = {
      user,
    };

    if (event) {
      condition = {
        ...condition,
        event,
      };
    }

    if (keyword) {
      condition = {
        ...condition,
        "historyEvent.title": { $regex: keyword, $options: "i" },
      };
    }

    if (startDate && endDate) {
      condition = {
        ...condition,
        createdAt: {
          $gte: startDate,
          $lte: moment(endDate).add(1, "days"),
        },
      };
    }

    const data = await Transaction.find(condition)
      .populate(
        "participant",
        "_id firstName lastName email role",
        "Participant"
      )
      .limit(limit)
      .skip(limit * (page - 1));

    const count = await Transaction.countDocuments(condition);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      current_page: parseInt(page),
      total_page: Math.ceil(count / limit),
      total_data: count,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { id: transactionId } = req.params;

    const data = await Transaction.findOne({ _id: transactionId }).populate(
      "participant",
      "_id firstName lastName email role",
      "Participant"
    );

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const createDummy = async (req, res, next) => {
  try {
    const { event, firstName, lastName, email, role, payment } = req.body;
    const participant = req.participant._id;

    const checkEvent = await Event.findOne({ _id: event })
      .select(
        "_id title price date cover about venueName tagline keyPoint category speaker"
      )
      .populate({
        path: "category",
        select: "_id name",
        model: "Category",
      })
      .populate({
        path: "speaker",
        select: "_id name role avatar",
        model: "Speaker",
      });

    if (!checkEvent)
      throw new CustomAPI.NotFound(`Event with id : ${event} not found`);

    const checkPayment = await Payment.findOne({ _id: payment }).select(
      "_id type imageUrl status"
    );
    if (!checkPayment)
      throw new CustomAPI.NotFound(`Payment with id : ${payment} not found`);

    const data = await Transaction.create({
      event,
      personalDetail: {
        firstName,
        lastName,
        email,
        role,
      },
      payment,
      historyEvent: checkEvent,
      historyPayment: checkPayment,
      participant,
    });

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getOne,
  createDummy,
};
