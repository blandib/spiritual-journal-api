
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { validateEntryData, validateObjectId } = require('../middleware/validators');
const errorHandler = require('../middleware/errorHandler');


/**
 * @swagger
 * tags:
 *   name: Entries
 *   description: Spiritual journal entries
 */

/**
 /**
/**
 * @swagger
 * /entries:
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const entries = await db.collection('entries').find({}).toArray();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: {
        type: 'ServerError',
        message: err.message,
        statusCode: 500
      }
    });
  }
});
/**
 * @swagger
 * /entries/{id}:
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
// GET single entry
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const entry = await db.collection('entries').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /entries:
 *   post:
 *     summary: Create new entry
 *     tags: [Entries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entry'
 *     responses:
 *       201:
 *         description: Created entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entry'
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// POST create entry
router.post('/',
   validateEntryData, 
   errorHandler, 
   async (req, res) => {
    const entry = {
      title: req.body.title,
      content: req.body.content,
      userId: new ObjectId(req.body.userId),
      createdAt: new Date(),
      tags: req.body.tags || [],
      mood: req.body.mood || 'neutral',
      visibility: req.body.visibility || 'private'
    };
    
    try {
      const db = req.app.locals.db;
      const result = await db.collection('entries').insertOne(entry);
      const newEntry = await db.collection('entries').findOne({ 
        _id: result.insertedId 
      });
      
      res.status(201).json(newEntry);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);


/**
 * @swagger
 * /entries/{id}:
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
 *     responses:
 *       200:
 *         description: Updated entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entry'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Entry not found
 */
// PUT update entry
router.put('/:id', 
  validateObjectId,
  validateEntryData,
  async (req, res) => {
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
        return res.status(404).json({ message: 'Entry not found' });
      }
      
      const updatedEntry = await db.collection('entries').findOne({ 
        _id: new ObjectId(req.params.id) 
      });
      
      res.json(updatedEntry);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);


/**
 * @swagger
 * /entries/{id}:
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
 *       200:
 *         description: Entry deleted
 *       404:
 *         description: Entry not found
 */
// DELETE entry
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await db.collection('entries').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /entries:
 *   post:
 *     summary: Create a new journal entry (simplified version)
 *     tags: [Entries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My Spiritual Reflection"
 *                 minLength: 1
 *               content:
 *                 type: string
 *                 example: "Today I prayed about..."
 *                 minLength: 1
 *               userId:
 *                 type: string
 *                 description: Valid MongoDB ObjectId
 *                 example: "507f1f77bcf86cd799439011"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["prayer", "gratitude"]
 *               mood:
 *                 type: string
 *                 enum: [joy, peace, gratitude, struggle, neutral]
 *                 default: neutral
 *               visibility:
 *                 type: string
 *                 enum: [private, public]
 *                 default: private
 *     responses:
 *       201:
 *         description: Entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entry'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: "ValidationError"
 *                     message:
 *                       type: string
 *                       example: "Title and content are required"
 *                     statusCode:
 *                       type: integer
 *                       example: 400
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: "ServerError"
 *                     message:
 *                       type: string
 *                       example: "Database connection failed"
 *                     statusCode:
 *                       type: integer
 *                       example: 500
 */
// POST create entry (temporary simplified version)
router.post('/', async (req, res) => {
  try {
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'ValidationError',
          message: 'Title and content are required',
          statusCode: 400
        }
      });
    }

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
    const newEntry = await db.collection('entries').findOne({ 
      _id: result.insertedId 
    });
    
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        type: 'ServerError',
        message: err.message,
        statusCode: 500
      }
    });
  }
});



module.exports = router;