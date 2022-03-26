const express = require("express");
const router = express.Router();

const {
  authenticationUser,
  authenticationParticipant,
} = require("../../../middlewares/auth");

const { getAll, getOne, createDummy } = require("./controller");

router.post("/create-dummy", authenticationParticipant, createDummy);

router.use(authenticationUser);

router.get("/get-all", getAll);
router.get("/get-one/:id", getOne);

module.exports = router;
