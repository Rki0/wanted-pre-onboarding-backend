const express = require("express");
const { body } = require("express-validator");

const userController = require("../controllers/user");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("유효한 이메일 주소를 입력해주세요."),
    body("password")
      .isLength({ min: 8 })
      .withMessage("최소 8자리 이상 입력해주세요."),
  ],
  userController.signUpUser
);

module.exports = router;
