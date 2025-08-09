const Comment = require("../models/comment");

// GET /comments
exports.getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find();
    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
};

// GET /comments/:id
exports.getCommentById = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    res.json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

// POST /comments
exports.createComment = async (req, res, next) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

// PUT /comments/:id
exports.updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    res.json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

// DELETE /comments/:id
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};
