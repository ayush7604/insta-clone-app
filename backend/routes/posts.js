const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

// create post
router.post("/", auth, async (req, res) => {
  const { imageUrl, caption } = req.body;

  try {
    const post = new Post({
      userId: req.userId,
      imageUrl,
      caption
    });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Could not create post" });
  }
});

// like or unlike post
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(req.userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.userId
      );
    } else {
      post.likes.push(req.userId);
    }

    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: "Like action failed" });
  }
});

// add comment
router.post("/:id/comment", auth, async (req, res) => {
  const { text } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      userId: req.userId,
      text
    });

    await post.save();
    res.json({ message: "Comment added" });
  } catch (err) {
    res.status(500).json({ message: "Comment failed" });
  }
});

module.exports = router;
