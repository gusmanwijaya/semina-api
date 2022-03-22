const express = require("express");
const router = express.Router();

const { authenticationParticipant } = require("../../../middlewares/auth");

const { landingPage, detailPage } = require("./controller");

router.use(authenticationParticipant);
router.get("/landing-page", landingPage);
router.get("/detail-page/:id", detailPage);

module.exports = router;
