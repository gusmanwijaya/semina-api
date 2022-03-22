const { StatusCodes } = require("http-status-codes");
const CustomAPI = require("../../../errors");

const Event = require("../event/model");

const landingPage = async (req, res, next) => {
  try {
    const { keyword, category, speaker } = req.query;

    let condition = {};

    if (keyword) {
      condition = {
        ...condition,
        title: {
          $regex: keyword,
          $options: "i",
        },
      };
    }

    if (category) {
      condition = {
        ...condition,
        category,
      };
    }

    if (speaker) {
      condition = {
        ...condition,
        speaker,
      };
    }

    const data = await Event.find(condition)
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

    const data = await Event.findOne({ _id: eventId })
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

module.exports = {
  landingPage,
  detailPage,
};
