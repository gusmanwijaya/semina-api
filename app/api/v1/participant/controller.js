const { StatusCodes } = require("http-status-codes");
const CustomAPI = require("../../../errors");

const Event = require("../event/model");
const Payment = require("../payment/model");
const Transaction = require("../transaction/model");

const landingPage = async (req, res, next) => {
  try {
    const data = await Event.find({ status: true })
      .select("_id title price date cover venueName category stock")
      .populate({
        path: "category",
        select: "_id name",
        model: "Category",
      })
      .limit(4);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const detailPage = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;

    const data = await Event.findOne({ _id: eventId, status: true })
      .select(
        "_id title price date cover venueName keyPoint tagline about speaker stock"
      )
      .populate({
        path: "speaker",
        select: "_id name role avatar",
        model: "Speaker",
      });

    if (!data)
      throw new CustomAPI.NotFound(`Event with id : ${eventId} not found`);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const checkout = async (req, res, next) => {
  try {
    const { event, firstName, lastName, email, role, payment } = req.body;
    const participant = req.participant._id;

    const checkEvent = await Event.findOne({ _id: event })
      .select(
        "_id title price date cover about venueName tagline keyPoint status stock category speaker stock"
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

    if (checkEvent.stock === 0) {
      throw new CustomAPI.BadRequest("Not enough stock");
    } else {
      checkEvent.stock = checkEvent.stock -= 1;
      await checkEvent.save();
    }

    const data = new Transaction({
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

    await data.save();

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const dashboard = async (req, res, next) => {
  try {
    const participant = req.participant._id;

    const data = await Transaction.find({ participant })
      .select(
        "_id event personalDetail payment historyEvent historyPayment participant"
      )
      .populate("participant", "_id firstName lastName email role");

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const payment = async (req, res, next) => {
  try {
    const { status } = req.query;

    let condition = {};

    if (status) {
      condition = {
        status,
      };
    }

    const data = await Payment.find(condition)
      .select("_id type imageUrl status user isChecked")
      .populate("user", "_id name email role", "User");

    res.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  landingPage,
  detailPage,
  checkout,
  dashboard,
  payment,
};
