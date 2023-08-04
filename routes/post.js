const express = require("express");

const postController = require("../controllers/post");
const checkAuth = require("../middlewares/auth");

const router = express.Router();

router.post("/", checkAuth, postController.createPost);

router.get("/:postId", postController.getPost);

module.exports = router;
