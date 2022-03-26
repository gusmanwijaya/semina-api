const Payment = require("./model");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../../../errors");
const fs = require("fs");
const config = require("../../../config");

const create = async (req, res, next) => {
  try {
    const { type, status } = req.body;
    const user = req.user._id;
    let data;

    const check = await Payment.findOne({ type, user });
    if (check) throw new CustomAPIError.BadRequest("Duplicate payment's name");

    if (!req.file) {
      data = new Payment({ type, status, user });
    } else {
      data = new Payment({ type, status, imageUrl: req.file.filename, user });
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
    const { status } = req.query;
    const user = req.user._id;

    let condition = {
      user,
    };

    if (status) {
      condition = {
        ...condition,
        status,
      };
    }

    const data = await Payment.find(condition)
      .select("_id type imageUrl status user")
      .populate("user", "_id name email role", "User");

    res.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, data });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { id: paymentId } = req.params;
    const user = req.user._id;

    const data = await Payment.findOne({ _id: paymentId, user })
      .select("_id type imageUrl status user")
      .populate("user", "_id name email role", "User");

    if (!data)
      throw new CustomAPIError.NotFound(
        `Payment with id : ${paymentId} not found`
      );

    res.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, data });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id: paymentId } = req.params;
    const { type } = req.body;
    const user = req.user._id;

    const check = await Payment.findOne({ _id: { $ne: paymentId }, type });
    if (check) throw new CustomAPIError.BadRequest("Duplicate payment's name");

    let data = await Payment.findOne({ _id: paymentId, user });

    if (!data)
      throw new CustomAPIError.NotFound(
        `Payment with id: ${paymentId} not found`
      );

    if (!req.file) {
      data.type = type;
      data.user = user;
    } else {
      let currentImage = `${config.rootPath}/public/uploads/payment/${data.imageUrl}`;

      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      data.type = type;
      data.imageUrl = req.file.filename;
      data.user = user;
    }

    await data.save();

    res.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, data });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id: paymentId } = req.params;
    const user = req.user._id;

    let data = await Payment.findOne({ _id: paymentId, user });
    if (!data)
      throw new CustomAPIError.NotFound(
        `Payment with id: ${paymentId} not found`
      );

    let currentImage = `${config.rootPath}/public/uploads/payment/${data.imageUrl}`;

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    await data.remove();

    res.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, data });
  } catch (error) {
    next(error);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    const { id: paymentId } = req.params;
    const user = req.user._id;

    let data = await Payment.findOne({ _id: paymentId, user });
    if (!data)
      throw new CustomAPIError.NotFound(
        `Payment with id: ${paymentId} not found`
      );

    data.status = !data.status;
    await data.save();

    res.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, getOne, update, destroy, changeStatus };
