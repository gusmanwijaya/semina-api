const CustomAPIError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticationUser = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new CustomAPIError.Forbidden("Invalid authentication");
    }

    const payload = isTokenValid({ token });

    req.user = {
      _id: payload._id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const authenticationParticipant = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new CustomAPIError.Forbidden("Invalid authentication");
    }

    const payload = isTokenValid({ token });

    req.participant = {
      _id: payload._id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomAPIError.Unauthorized(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

module.exports = { authenticationUser, authenticationParticipant };
