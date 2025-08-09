const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");
const validators = require("../middleware/validators");

// Route to get all comments
router.get("/", commentsController.getAllComments);

// Route to get a single comment by ID
router.get(
  "/:id",
  validators.updateCommentValidator,
  commentsController.getCommentById
);

// Route to add a new comment
router.post(
  "/",
  validators.createCommentValidator,
  commentsController.createComment
);

// Route to update a comment by ID
router.put(
  "/:id",
  validators.updateCommentValidator,
  commentsController.updateComment
);

// Route to delete a comment by ID
router.delete(
  "/:id",
  validators.updateCommentValidator,
  commentsController.deleteComment
);

module.exports = router;
