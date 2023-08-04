const express = require("express");

const postController = require("../controllers/post");
const checkAuth = require("../middlewares/auth");

const router = express.Router();

router.post("/", checkAuth, postController.createPost);

router.get("/posts", postController.getPosts);

router.get("/:postId", postController.getPost);

router.delete("/:postId", checkAuth, postController.deletePost);

router.patch("/:postId", checkAuth, postController.updatePost);

module.exports = router;
