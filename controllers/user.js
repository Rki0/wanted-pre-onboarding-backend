const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const HttpError = require("../models/http-error");

exports.signUpUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError(errors.array()[0].msg, 422);

    return next(error);
  }

  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ where: { email } });
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

exports.loginUser = async (req, res, next) => {
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

  if (!existingUser) {
    const error = new HttpError(
      "가입되지 않은 이메일입니다. 다시 시도해주세요.",
      422
    );

    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("비밀번호 비교 실패. 다시 시도해주세요.", 500);

    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "비밀번호가 일치하지 않습니다. 다시 시도해주세요.",
      401
    );

    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("JWT 토큰 생성 실패. 다시 시도해주세요.", 500);

    return next(error);
  }

  res.status(200).json({
    token,
  });
};
