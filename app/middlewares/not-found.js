const NotFound = (req, res) =>
  res.status(404).json({
    statusCode: 404,
    message: "Route doesn't exist",
  });

module.exports = NotFound;
