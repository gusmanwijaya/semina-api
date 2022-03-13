module.exports = {
  getAll: async (req, res, next) => {
    try {
      res.status(200).json({
        status: 200,
        message: "Welcome to API Semina",
      });
    } catch (error) {
      next(error);
    }
  },
};
