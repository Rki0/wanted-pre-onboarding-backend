const { validationResult } = require("express-validator");

const User = require("../models/user");
const Post = require("../models/post");
const HttpError = require("../models/http-error");

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError(errors.array()[0].msg, 400);

    return next(error);
  }

  const { title, description } = req.body;

  try {
    await req.user.createPost({
      title,
      description,
    });
  } catch (err) {
    const error = new HttpError("게시물 생성 실패. 다시 시도해주세요.", 500);

    return next(error);
  }

  return res.status(201).json({ message: "게시물이 등록되었습니다." });
};

exports.getPosts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 3;

  try {
    const { count, rows } = await Post.findAndCountAll({
      offset: (page - 1) * perPage,
      limit: perPage,
    });

    res.json({
      count,
      totalPages: Math.ceil(count / perPage),
      currentPage: page,
      posts: rows,
    });
  } catch (err) {
    const error = new HttpError("게시물 조회 실패. 다시 시도해주세요.", 500);

    return next(error);
  }
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

exports.deletePost = async (req, res, next) => {
  const userId = req.user.id;

  const postId = req.params.postId;

  let post;
  try {
    post = await Post.findByPk(postId);
  } catch (err) {
    const error = new HttpError("게시물 조회 실패. 다시 시도해주세요.", 500);

    return next(error);
  }

  if (!post) {
    return res
      .status(500)
      .json({ message: "존재하지 않는 게시물입니다. 다시 시도해주세요." });
  }

  if (userId !== post.userId) {
    return res.status(402).json({ message: "게시물 삭제 권한이 없습니다." });
  }

  let deletedPost;
  try {
    deletedPost = await Post.destroy({
      where: { id: postId },
    });
  } catch (err) {
    const error = new HttpError(
      "게시물 삭제 중 에러가 발생했습니다. 다시 시도해주세요.",
      500
    );

    return next(error);
  }

  if (deletedPost === 0) {
    return res
      .status(404)
      .json({ error: "해당 아이디의 게시물을 찾을 수 없습니다." });
  }

  return res.status(200).json({ message: "게시물이 삭제되었습니다." });
};

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError(errors.array()[0].msg, 400);

    return next(error);
  }

  const userId = req.user.id;

  const postId = req.params.postId;

  let post;
  try {
    post = await Post.findByPk(postId);
  } catch (err) {
    const error = new HttpError("게시물 조회 실패. 다시 시도해주세요.", 500);

    return next(error);
  }

  if (!post) {
    return res
      .status(500)
      .json({ message: "존재하지 않는 게시물입니다. 다시 시도해주세요." });
  }

  if (userId !== post.userId) {
    return res.status(402).json({ message: "게시물 수정 권한이 없습니다." });
  }

  const { title, description } = req.body;

  if (title) {
    post.title = title;
  }

  if (description) {
    post.description = description;
  }

  try {
    await post.save();
  } catch (err) {
    const error = new HttpError("게시물 수정 실패. 다시 시도해주세요.", 500);

    return next(error);
  }

  return res.status(200).json({ message: "게시물 수정 완료." });
};
