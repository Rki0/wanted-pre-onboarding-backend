const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const HttpError = require("../models/http-error");

exports.createUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError(errors.array()[0].msg, 422);

    return next(error);
  }

  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("사용자 검색 실패. 다시 시도해주세요.", 500);

    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "이미 가입된 이메일입니다. 다시 시도해주세요.",
      422
    );

    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "비밀번호 암호화 실패. 다시 시도해주세요.",
      500
    );

    return next(error);
  }

  try {
    await User.create({ email, password: hashedPassword });
  } catch (err) {
    const error = new HttpError("회원가입 실패. 다시 시도해주세요.", 500);

    return next(error);
  }

  return res.status(201).json({ message: "회원가입 성공." });
};
