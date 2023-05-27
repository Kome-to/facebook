const Post = require("../models/Post");
const User = require("../models/User");
const Notify = require("../models/Notify");

exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    await post.populate("user", "first_name last_name cover picture username");
    const user = await User.findById(req.user.id);
    await new Notify({
      user: user.id,
      recipients: [...user.followers],
      isRead: false,
      text: "Create post",
      content: req.body.text,
    }).save();
    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.sharePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId);

    if (
      post.user.toString() !== req.user.id &&
      !post.sharer.includes(req.user.id)
    ) {
      let updatePost = await Post.findByIdAndUpdate(
        postId,
        {
          $push: {
            sharer: req.user.id,
          },
        },
        {
          new: true,
        }
      );
      await new Notify({
        user: req.user.id,
        recipients: [post.user.toString()],
        isRead: false,
        text: "Share your post",
      }).save();
      return res.json(updatePost);
    }
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const followingTemp = await User.findById(req.user.id).select("following");
    const following = followingTemp.following;
    const promises = following.map((user) => {
      return Post.find({ user: user })
        .populate("user", "first_name last_name picture username cover")
        .populate("comments.commentBy", "first_name last_name picture username")
        .sort({ createdAt: -1 })
        .limit(10);
    });
    const followingPosts = await (await Promise.all(promises)).flat();
    const userPosts = await Post.find({ user: req.user.id })
      .populate("user", "first_name last_name picture username cover")
      .populate("comments.commentBy", "first_name last_name picture username")
      .sort({ createdAt: -1 })
      .limit(10);
    const sharePosts = [];
    for (const id of [...following, req.user.id]) {
      let posts = await Post.find({ sharer: id })
        .populate("user", "first_name last_name picture username cover")
        .populate("comments.commentBy", "first_name last_name picture username")
        .populate("sharer", "first_name last_name picture username cover");
      posts = posts.map((post) => ({ ...post._doc, userShare: id }));
      sharePosts.push(
        ...posts.map((post) => ({
          ...post,
          sharer: post.sharer.find((share) => share.id == id),
        }))
      );
    }
    followingPosts.push(...[...userPosts]);
    followingPosts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    res.json(followingPosts.concat(sharePosts));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.comment = async (req, res) => {
  try {
    const { comment, image, postId } = req.body;
    let newComments = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            comment: comment,
            image: image,
            commentBy: req.user.id,
            commentAt: new Date(),
          },
        },
      },
      {
        new: true,
      }
    ).populate("comments.commentBy", "picture first_name last_name username");
    if (req.user.id !== newComments.user.toString()) {
      await new Notify({
        user: req.user.id,
        recipients: [newComments.user],
        isRead: false,
        text: "Comment your post",
        content: comment,
      }).save();
    }
    res.json(newComments.comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.savePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = await User.findById(req.user.id);
    const check = user?.savedPosts.find(
      (post) => post.post.toString() == postId
    );
    if (check) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: {
          savedPosts: {
            _id: check._id,
          },
        },
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          savedPosts: {
            post: postId,
            savedAt: new Date(),
          },
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.id);
    res.json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
