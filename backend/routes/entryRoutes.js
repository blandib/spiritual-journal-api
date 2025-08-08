// routes/entryRoutes.js
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { validateEntryData, validateObjectId } = require('../middleware/validators');

/**
 * @swagger
 * tags:
 *   name: Entries
 *   description: Spiritual journal entries
 */

/**
 * @swagger
 * /api/entries:
 *   get:
 *     summary: Get all journal entries
 *     description: Returns a list of all spiritual journal entries
 *     tags: [Entries]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Entry'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const entries = await db.collection('entries').find({}).toArray();
    return res.status(200).json(entries);
  } catch (err) {
    return next(err);
  }
});

/**
 * @swagger
 * /api/entries/{id}:
 *   get:
 *     summary: Get entry by ID
 *     tags: [Entries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entry data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entry'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Entry not found
 */
router.get('/:id', validateObjectId, async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const entry = await db.collection('entries').findOne({ _id: new ObjectId(req.params.id) });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    return res.status(200).json(entry);
  } catch (err) {
    return next(err);
  }
});

/**
 * @swagger
 * /api/entries:
 *   post:
 *     summary: Create new entry
 *     tags: [Entries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entry'
 *           example:
 *             title: "My Day"
 *             content: "Grateful for..."
 *             tags: ["gratitude"]
 *             userId: "507f1f77bcf86cd799439011"
 *     responses:
 *       201:
 *         description: Created entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entry'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', validateEntryData, async (req, res, next) => {
  try {
    const entry = {
      title: req.body.title,
      content: req.body.content,
      userId: new ObjectId(req.body.userId),
      createdAt: new Date(),
      tags: req.body.tags || [],
      mood: req.body.mood || 'neutral',
      visibility: req.body.visibility || 'private'
    };

    const db = req.app.locals.db;
    const result = await db.collection('entries').insertOne(entry);
    const newEntry = await db.collection('entries').findOne({ _id: result.insertedId });

    return res.status(201).json(newEntry);
  } catch (err) {
    return next(err);
  }
});

/**
 * @swagger
 * /api/entries/{id}:
 *   put:
 *     summary: Update entry
 *     tags: [Entries]
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
 *             $ref: '#/components/schemas/Entry'
 *           example:
 *             title: "Updated Title"
 *             content: "Updated content"
 *             tags: ["peace"]
 *     responses:
 *       200:
 *         description: Updated entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entry'
 *       400:
 *         description: Invalid input or ID
 *       404:
 *         description: Entry not found
 */
router.put('/:id', validateObjectId, validateEntryData, async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const updateData = {
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags || [],
      mood: req.body.mood || 'neutral',
      visibility: req.body.visibility || 'private',
      updatedAt: new Date()
    };

    const result = await db.collection('entries').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const updatedEntry = await db.collection('entries').findOne({ _id: new ObjectId(req.params.id) });
    return res.status(200).json(updatedEntry);
  } catch (err) {
    return next(err);
  }
});

/**
 * @swagger
 * /api/entries/{id}:
 *   delete:
 *     summary: Delete entry
 *     tags: [Entries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No Content (deleted)
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Entry not found
 */
router.delete('/:id', validateObjectId, async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const result = await db.collection('entries').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
