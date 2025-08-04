
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { validateUserData, validateObjectId } = require('../middleware/validators');
const errorHandler = require('../middleware/errorHandler');

// GET all users
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const users = await db.collection('users').find({}).toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single user
router.get('/:id', validateObjectId, errorHandler, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create user
router.post('/', validateUserData, errorHandler, async (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    createdAt: new Date()
  };
  
  try {
    const db = req.app.locals.db;
    
    // Check for existing email
    const existingUser = await db.collection('users').findOne({ email: user.email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    
    const result = await db.collection('users').insertOne(user);
    const newUser = await db.collection('users').findOne({ _id: result.insertedId });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update user
router.put('/:id', validateObjectId, validateUserData, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      updatedAt: new Date()  // Add update timestamp
    };
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE user
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;