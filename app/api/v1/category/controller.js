const Category = require("./model");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../../../errors");

const getAll = async (req, res, next) => {
  try {
    const user = req.user._id;
    const data = await Category.find({ user }).select("_id name user");

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = req.user._id;

    const check = await Category.findOne({ name, user });
    if (check) throw new CustomAPIError.BadRequest("Duplicate category's name");

    const data = await Category.create({ name, user });

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { id: categoryId } = req.params;

    const data = await Category.findOne({ _id: categoryId }).select(
      "_id name user"
    );
    if (!data)
      throw new CustomAPIError.NotFound(
        `Category with id: ${categoryId} not found`
      );

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
    const { id: categoryId } = req.params;
    const user = req.user._id;
    const { name } = req.body;

    const check = await Category.findOne({
      _id: {
        $ne: categoryId,
      },
      name,
    });

    if (check) throw new CustomAPIError.BadRequest("Duplicate category's name");

    const data = await Category.findOneAndUpdate(
      { _id: categoryId },
      {
        name,
        user,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!data)
      throw new CustomAPIError.NotFound(
        `Category with id: ${categoryId} not found`
      );

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
    const { id: categoryId } = req.params;

    const data = await Category.findOne({ _id: categoryId });
    if (!data)
      throw new CustomAPIError.NotFound(
        `Category with id: ${categoryId} not found`
      );

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
  getAll,
  getOne,
  create,
  update,
  destroy,
};
