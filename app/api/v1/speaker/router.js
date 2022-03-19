const express = require("express");
const router = express.Router();

const { create, getAll, getOne, update, destroy } = require("./controller");
const { authenticationUser } = require("../../../middlewares/auth");

router.use(authenticationUser);
router.post("/create", create);
router.get("/get-all", getAll);
router.get("/get-one/:id", getOne);
router.put("/update/:id", update);
router.delete("/destroy/:id", destroy);

module.exports = router;
