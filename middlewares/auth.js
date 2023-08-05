const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      throw new Error("로그인이 필요합니다.");
    }

    const extractedToken = token.split(" ")[1];

    const decodedToken = jwt.verify(extractedToken, process.env.JWT_KEY);

    if (decodedToken.exp <= Date.now() / 1000) {
      throw new Error("토큰이 만료되었습니다.");
    }

    const user = await User.findOne({
      where: { userId: decodedToken.id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      const error = new HttpError(
        "존재하지 않는 유저입니다. 다시 시도해주세요.",
        500
      );

      return next(error);
    }

    if (user.email !== decodedToken.email || user.userId !== decodedToken.id) {
      throw new Error("인증에 실패하였습니다.");
    }

    req.user = user;

    next();
  } catch (err) {
    const error = new HttpError(err, 403);
    return next(error);
  }
};
