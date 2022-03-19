const Speaker = require("./model");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../../../errors");

const create = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = req.user._id;

    const check = await Speaker.findOne({ name, user });
    if (check) throw new CustomAPIError.BadRequest("Duplicate speaker's name");

    const data = await Speaker.create({ name, user });
    res
      .status(StatusCodes.CREATED)
      .json({ statusCode: StatusCodes.CREATED, data });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const user = req.user._id;

    const data = await Speaker.find({ user }).select("_id name user");

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
      "_id name user"
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
    const { name } = req.body;
    const user = req.user._id;

    const check = await Speaker.findOne({ _id: { $ne: speakerId }, name });
    if (check) throw new CustomAPIError.BadRequest("Duplicate speaker's name");

    const data = await Speaker.findOneAndUpdate(
      { _id: speakerId },
      { name, user },
      { new: true, runValidators: true }
    );

    if (!data)
      throw new CustomAPIError.NotFound(
        `Speaker with id: ${speakerId} not found`
      );

    res.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, data });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id: speakerId } = req.params;

    const data = await Speaker.findOne({ _id: speakerId });
    if (!data)
      throw new CustomAPIError.NotFound(
        `Speaker with id: ${speakerId} not found`
      );

    await data.remove();
    res.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, getOne, update, destroy };
