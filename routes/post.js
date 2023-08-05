const express = require("express");
const { body } = require("express-validator");

const postController = require("../controllers/post");
const checkAuth = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/",
  checkAuth,
  [
    body("title")
      .isLength({ min: 1, max: 255 })
      .withMessage("1자 이상, 255자 이하로 입력해주세요."),
    body("description")
      .isLength({ min: 1 })
      .withMessage("최소 1자 이상 입력해주세요."),
  ],
  postController.createPost
);

router.get("/posts", postController.getPosts);

router.get("/:postId", postController.getPost);

router.delete("/:postId", checkAuth, postController.deletePost);

router.patch(
  "/:postId",
  checkAuth,
  [
    body("title")
      .isLength({ max: 255 })
      .withMessage("255자 이하로 입력해주세요."),
  ],
  postController.updatePost
);

module.exports = router;
