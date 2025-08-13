const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { validateObjectId } = require("../middleware/validators");
const errorHandler = require("../middleware/errorHandler");

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: User comments on entries
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const comments = await db.collection("comments").find({}).toArray();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Comment data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.get("/:id", validateObjectId, errorHandler, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const comment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Add a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res) => {
  const { entryId, userId, text } = req.body;

  if (!entryId || typeof entryId !== "string") {
    return res.status(400).json({ error: "Valid entryId is required." });
  }
  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Valid userId is required." });
  }
  if (!text || typeof text !== "string" || text.trim() === "") {
    return res
      .status(400)
      .json({ error: "Text is required and must be a non-empty string." });
  }

  const comment = {
    entryId,
    userId,
    text,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  try {
    const db = req.app.locals.db;
    const result = await db.collection("comments").insertOne(comment);
    const newComment = await db
      .collection("comments")
      .findOne({ _id: result.insertedId });
    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error inserting comment:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: Updated comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.put("/:id", async (req, res) => {
  const { text } = req.body;
  if (text && (typeof text !== "string" || text.trim() === "")) {
    return res.status(400).json({ error: "Text must be a non-empty string." });
  }
  try {
    const db = req.app.locals.db;
    const updateData = {
      entryId: req.body.entryId,
      userId: req.body.userId,
      text: req.body.text,
      updatedAt: new Date(),
    };
    const result = await db
      .collection("comments")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const updatedComment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(req.params.id) });
    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await db
      .collection("comments")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
