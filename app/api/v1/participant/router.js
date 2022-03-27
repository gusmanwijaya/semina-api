const express = require("express");
const router = express.Router();

const { authenticationParticipant } = require("../../../middlewares/auth");

const {
  landingPage,
  detailPage,
  checkout,
  dashboard,
} = require("./controller");

router.get("/landing-page", landingPage);
router.get("/detail-page/:id", detailPage);
router.post("/checkout", authenticationParticipant, checkout);
router.get("/dashboard", authenticationParticipant, dashboard);

module.exports = router;
