const express = require("express");
const router = express.Router();

const { getAll, create, destroy, getOne, update } = require("./controller");
const { authenticationUser } = require("../../../middlewares/auth");

router.use(authenticationUser);
router.get("/get-all", getAll);
router.get("/get-one/:id", getOne);
router.post("/create", create);
router.put("/update/:id", update);
router.delete("/destroy/:id", destroy);

module.exports = router;
