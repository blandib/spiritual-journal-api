require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();

// ===== 1. BASIC CONFIG =====
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== 2. DATABASE CONNECTION =====
const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    app.locals.db = db;
    console.log('✅ MongoDB Connected');
    return db;
  } catch (err) {
    console.error('❌ MongoDB Connection Failed');
    process.exit(1);
  }
};

// ===== 3. ROUTES =====
app.use('/users', require('./routes/userRoutes'));
app.use('/entries', require('./routes/entryRoutes'));
app.use('/test', require('./routes/testRoutes'));

// ===== 4. SWAGGER =====
require('./swagger')(app);

// ===== 5. CORE ROUTES =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', db: !!app.locals.db });
});

// ===== 6. ERROR HANDLER (MUST BE LAST) =====
app.use(require('./middleware/errorHandler'));

// ===== 7. SERVER START =====
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` API Docs: http://localhost:${PORT}/api-docs`);
  });
};

startServer();