const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../../../../errors");
const { createJWT, createTokenParticipant } = require("../../../../utils");

const Participant = require("./model");

const signUp = async (req, res, next) => {
  try {
    const { firstName, lastName, email, role, password } = req.body;

    const data = new Participant({
      firstName,
      lastName,
      email,
      role,
      password,
    });

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
      throw new CustomAPIError.Unauthorized("Invalid credentials");

    const data = await Participant.findOne({ email });
    if (!data) throw new CustomAPIError.Unauthorized("Invalid credentials");

    const isPasswordMatch = await data.comparePassword(password);
    if (!isPasswordMatch)
      throw new CustomAPIError.Unauthorized("Invalid credentials");

    const token = createJWT({
      payload: createTokenParticipant(data),
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

module.exports = {
  signUp,
  signIn,
};
