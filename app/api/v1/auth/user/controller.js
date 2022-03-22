const User = require("./model");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../../../../errors");
const { createJWT, createTokenUser } = require("../../../../utils");

const signUp = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const data = new User({ name, email, password, role });
    await data.save();
    delete data._doc.password;

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new CustomAPIError.BadRequest("Email or password can't be empty");

    const data = await User.findOne({ email });

    if (!data) throw new CustomAPIError.Unauthorized("Invalid credentials");

    const isPasswordCorrect = await data.comparePassword(password);
    if (!isPasswordCorrect)
      throw new CustomAPIError.Unauthorized("Invalid credentials");

    const token = createJWT({
      payload: createTokenUser(data),
    });

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signUp, signIn };
