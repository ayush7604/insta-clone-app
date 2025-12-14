const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const userIds = user.following;
    userIds.push(req.userId);

    const posts = await Post.find({
      userId: { $in: userIds }
    })
      .sort({ createdAt: -1 })
      .populate("userId", "username")
      .populate("comments.userId", "username");

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch feed" });
  }
});

module.exports = router;
