require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const swaggerSetup = require('./swagger');
const errorHandler = require('./middleware/errorHandler');
// Routes
const userRoutes = require('./routes/userRoutes');
const entryRoutes = require('./routes/entryRoutes');

// Middleware
app.use(express.json());
// API Routes
app.use('/users', userRoutes);
app.use('/entries', entryRoutes);
// After routes
app.use(errorHandler);
// MongoDB Connection
let db;
let client;

async function connectDB() {
  try {
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB');
    
    // Pass db to routes
    app.locals.db = db;
    
    // Set up Swagger documentation
    swaggerSetup(app);
    
    // Basic Route
    app.get('/', (req, res) => {
      res.send('Spiritual Journal API Running');
    });
    
    
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
}
app.get('/test-db', async (req, res) => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    await client.close();
    res.send('MongoDB connection successful!');
  } catch (err) {
    res.status(500).send('MongoDB connection failed: ' + err.message);
  }
});

// Start the application
connectDB();

// Graceful shutdown
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});