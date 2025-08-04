require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testConnection() {
  // Verify MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is not defined in .env file');
    return;
  }

  console.log('Using MONGODB_URI:', process.env.MONGODB_URI.replace(/:[^@]+@/, ':*****@'));

  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // Test database access
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log(' Collections:', collections.map(c => c.name));
    
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
  } finally {
    await client.close();
  }
}

testConnection();