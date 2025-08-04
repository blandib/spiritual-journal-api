
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { validateEntryData, validateObjectId } = require('../middleware/validators');
const errorHandler = require('../middleware/errorHandler');
//const { validateEntryData, validateObjectId } = require('../middleware/validators');

// GET all entries
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const entries = await db.collection('entries').find({}).toArray();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

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