const express = require("express");
const router = express.Router();

const { authenticationParticipant } = require("../../../middlewares/auth");

const { landingPage, detailPage } = require("./controller");

router.get("/landing-page", landingPage);
router.get("/detail-page/:id", detailPage);

// router.use(authenticationParticipant);

module.exports = router;
