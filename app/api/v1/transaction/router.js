const express = require("express");
const router = express.Router();

const { authenticationUser } = require("../../../middlewares/auth");

const { getAll, getOne } = require("./controller");

router.use(authenticationUser);

router.get("/get-all", getAll);
router.get("/get-one/:id", getOne);

module.exports = router;
