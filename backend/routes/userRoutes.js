// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { validateUserData, validateObjectId } = require('../middleware/validators');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User account management
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res, next) => {
  try {
    const users = await req.app.locals.db.collection('users').find({}).toArray();
    return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:id', validateObjectId, async (req, res, next) => {
  try {
    const user = await req.app.locals.db
      .collection('users')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             name: "Jane Doe"
 *             email: "jane@example.com"
 *     responses:
 *       201:
 *         description: Created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
router.post('/', validateUserData, async (req, res, next) => {
  try {
    const doc = { name: req.body.name, email: req.body.email, createdAt: new Date() };

    const existing = await req.app.locals.db
      .collection('users')
      .findOne({ email: doc.email });
    if (existing) return res.status(409).json({ error: 'Email already exists' });

    const r = await req.app.locals.db.collection('users').insertOne(doc);
    const created = await req.app.locals.db.collection('users').findOne({ _id: r.insertedId });
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
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
 *             $ref: '#/components/schemas/User'
 *           example:
 *             name: "Jane Updated"
 *             email: "jane.updated@example.com"
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/:id', validateObjectId, validateUserData, async (req, res, next) => {
  try {
    const update = { name: req.body.name, email: req.body.email, updatedAt: new Date() };

    const r = await req.app.locals.db
      .collection('users')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: update });

    if (r.matchedCount === 0) return res.status(404).json({ error: 'User not found' });

    const updated = await req.app.locals.db
      .collection('users')
      .findOne({ _id: new ObjectId(req.params.id) });
    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
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
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', validateObjectId, async (req, res, next) => {
  try {
    const r = await req.app.locals.db
      .collection('users')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (r.deletedCount === 0) return res.status(404).json({ error: 'User not found' });
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
});



module.exports = router;
