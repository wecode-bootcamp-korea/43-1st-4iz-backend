const express = require("express");

const { userController } = require("../controllers");

const router = express.Router();

router.post("/duplicate", userController.checkDuplicateUser);
router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);

module.exports = router;
