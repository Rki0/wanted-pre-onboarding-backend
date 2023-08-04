const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.id,
    };

    next();
  } catch (err) {
    const error = new HttpError("인증 실패. 다시 시도해주세요.", 403);

    return next(error);
  }
};
