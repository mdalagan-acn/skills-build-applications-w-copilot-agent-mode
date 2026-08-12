import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());

// MongoDB connection
const mongoDBURI = 'mongodb://localhost:27017/octofit-tracker';

mongoose.connect(mongoDBURI)
  .then(() => {
    console.log('✓ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err);
  });

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'OctoFit Tracker API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
});
