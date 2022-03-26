const { StatusCodes } = require("http-status-codes");
const CustomAPI = require("../../../errors");
const config = require("../../../config");
const fs = require("fs");

const Event = require("./model");
const Category = require("../category/model");
const Speaker = require("../speaker/model");

const create = async (req, res, next) => {
  try {
    const {
      title,
      price,
      date,
      about,
      venueName,
      tagline,
      keyPoint,
      category,
      speaker,
    } = req.body;
    const user = req.user._id;
    let data;

    if (!keyPoint) throw new CustomAPI.BadRequest("Key point can't be empty");
    if (!category) throw new CustomAPI.BadRequest("Category can't be empty");
    if (!speaker) throw new CustomAPI.BadRequest("Speaker can't be empty");

    const checkCategory = await Category.findOne({ _id: category });
    if (!checkCategory)
      throw new CustomAPI.NotFound(`Category with id : ${category} not found`);

    const checkSpeaker = await Speaker.findOne({ _id: speaker });
    if (!checkSpeaker)
      throw new CustomAPI.NotFound(`Speaker with id : ${speaker} not found`);

    if (!req.file)
      throw new CustomAPI.BadRequest(
        "Cover can't be empty, please upload an image"
      );

    data = new Event({
      title,
      price,
      date,
      about,
      venueName,
      tagline,
      keyPoint: JSON.parse(keyPoint),
      category,
      speaker,
      cover: req.file.filename,
      user,
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

const getAll = async (req, res, next) => {
  try {
    const { keyword, category, speaker } = req.query;
    const user = req.user._id;

    let condition = {
      user,
    };

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
        "_id title price date cover about venueName tagline keyPoint category speaker user"
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
      })
      .populate({
        path: "user",
        select: "_id name email role",
        model: "User",
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
    const { id: eventId } = req.params;
    const user = req.user._id;

    if (!eventId) throw new CustomAPI.BadRequest("Event id can't be empty");

    const data = await Event.findOne({ _id: eventId, user })
      .select(
        "_id title price date cover about venueName tagline keyPoint category speaker user"
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
      })
      .populate({
        path: "user",
        select: "_id name email role",
        model: "User",
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

const update = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;
    const {
      title,
      price,
      date,
      about,
      venueName,
      tagline,
      keyPoint,
      category,
      speaker,
    } = req.body;
    const user = req.user._id;
    let data;

    if (!keyPoint) throw new CustomAPI.BadRequest("Key point can't be empty");
    if (!category) throw new CustomAPI.BadRequest("Category can't be empty");
    if (!speaker) throw new CustomAPI.BadRequest("Speaker can't be empty");

    const checkCategory = await Category.findOne({ _id: category });
    if (!checkCategory)
      throw new CustomAPI.NotFound(`Category with id : ${category} not found`);

    const checkSpeaker = await Speaker.findOne({ _id: speaker });
    if (!checkSpeaker)
      throw new CustomAPI.NotFound(`Speaker with id : ${speaker} not found`);

    const checkTitle = await Event.findOne({
      _id: {
        $ne: eventId,
      },
      title,
      user,
    });
    if (checkTitle) throw new CustomAPI.BadRequest("Duplicate event's title");

    data = await Event.findOne({ _id: eventId, user });

    if (!data)
      throw new CustomAPI.NotFound(`Event with id : ${eventId} not found`);

    if (!req.file) {
      data.title = title;
      data.price = price;
      data.date = date;
      data.about = about;
      data.venueName = venueName;
      data.tagline = tagline;
      data.keyPoint = JSON.parse(keyPoint);
      data.category = category;
      data.speaker = speaker;
      data.user = user;
    } else {
      let currentImage = `${config.rootPath}/public/uploads/event/${data.cover}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      data.title = title;
      data.price = price;
      data.date = date;
      data.about = about;
      data.venueName = venueName;
      data.tagline = tagline;
      data.keyPoint = JSON.parse(keyPoint);
      data.category = category;
      data.speaker = speaker;
      data.cover = req.file.filename;
      data.user = user;
    }

    await data.save();

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;
    const user = req.user._id;

    const data = await Event.findOne({ _id: eventId, user });
    if (!data)
      throw new CustomAPI.NotFound(`Event with id : ${eventId} not found`);

    let currentImage = `${config.rootPath}/public/uploads/event/${data.cover}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    await data.remove();

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  destroy,
};
