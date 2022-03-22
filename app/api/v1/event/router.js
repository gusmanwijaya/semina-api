const express = require("express");
const router = express.Router();

const { authenticationUser } = require("../../../middlewares/auth");
const uploadMiddleware = require("../../../middlewares/multer");

const { create, getAll, getOne, update, destroy } = require("./controller");

router.use(authenticationUser);

router.post("/create", uploadMiddleware.single("cover"), create);
router.get("/get-all", getAll);
router.get("/get-one/:id", getOne);
router.put("/update/:id", uploadMiddleware.single("cover"), update);
router.delete("/destroy/:id", destroy);

module.exports = router;
