const Speaker = require("./model");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../../../errors");
const fs = require("fs");
const config = require("../../../config");

const create = async (req, res, next) => {
  try {
    const { name, role } = req.body;
    const user = req.user._id;
    let data;

    const check = await Speaker.findOne({ name, user });
    if (check) throw new CustomAPIError.BadRequest("Duplicate speaker's name");

    if (!req.file) {
      data = new Speaker({ name, role, user });
    } else {
      data = new Speaker({ name, role, avatar: req.file.filename, user });
    }

    await data.save();

    res
      .status(StatusCodes.CREATED)
      .json({ statusCode: StatusCodes.CREATED, data });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    const user = req.user._id;

    let condition = {
      user,
    };

    if (keyword) {
      condition = {
        ...condition,
        name: {
          $regex: keyword,
          $options: "i",
        },
      };
    }

    const data = await Speaker.find(condition).select("_id name role user");

    res.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, data });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { id: speakerId } = req.params;
    const user = req.user._id;

    const data = await Speaker.findOne({ _id: speakerId, user }).select(
      "_id name role user"
    );

    if (!data)
      throw new CustomAPIError.NotFound(
        `Speaker with id : ${speakerId} not found`
      );

    res.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, data });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id: speakerId } = req.params;
    const { name, role } = req.body;
    const user = req.user._id;

    const check = await Speaker.findOne({ _id: { $ne: speakerId }, name });
    if (check) throw new CustomAPIError.BadRequest("Duplicate speaker's name");

    let data = await Speaker.findOne({ _id: speakerId, user });

    if (!data)
      throw new CustomAPIError.NotFound(
        `Speaker with id: ${speakerId} not found`
      );

    if (!req.file) {
      (data.name = name), (data.role = role);
    } else {
      let currentImage = `${config.rootPath}/public/uploads/speaker/${data.avatar}`;

      if (data.avatar !== "images/avatar.png" && fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      data.name = name;
      data.role = role;
      data.avatar = req.file.filename;
    }

    await data.save();

    res.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, data });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id: speakerId } = req.params;
    const user = req.user._id;

    let data = await Speaker.findOne({ _id: speakerId, user });
    if (!data)
      throw new CustomAPIError.NotFound(
        `Speaker with id: ${speakerId} not found`
      );

    let currentImage = `${config.rootPath}/public/uploads/speaker/${data.avatar}`;

    if (data.avatar !== "images/avatar.png" && fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    await data.remove();

    res.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, getOne, update, destroy };
