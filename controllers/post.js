const User = require("../models/user");
const Post = require("../models/post");
const HttpError = require("../models/http-error");

exports.createPost = async (req, res, next) => {
  const email = req.userData.email;

  let user;
  try {
    user = await User.findOne({ where: { email } });
  } catch (err) {
    const error = new HttpError("사용자 검색 실패. 다시 시도해주세요.", 500);

    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "존재하지 않는 유저입니다. 다시 시도해주세요.",
      500
    );

    return next(error);
  }

  const { title, description } = req.body;

  try {
    await user.createPost({
      title,
      description,
    });
  } catch (err) {
    const error = new HttpError("게시물 생성 실패. 다시 시도해주세요.", 500);

    return next(error);
  }

  return res.status(201).json({ message: "게시물이 등록되었습니다." });
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;

  let post;
  try {
    post = await Post.findByPk(postId);
  } catch (err) {
    const error = new HttpError("게시물 조회 실패. 다시 시도해주세요.", 500);

    return next(error);
  }

  if (!post) {
    const error = new HttpError(
      "게시물이 존재하지 않습니다. 다시 시도해주세요.",
      500
    );

    return next(error);
  }

  res.status(200).json({ post });
};
