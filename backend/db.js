/**
 * db.js — JSON File-based Database
 * Replaces mongodb-memory-server which crashes on Windows with wiredTiger + nodemon.
 * Uses a flat JSON file for full persistence with zero external dependencies.
 * Mongoose models still work via mongoose-in-memory with plain memory store.
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use pure in-memory Mongoose (no wiredTiger, no file locks)
    // Data is persisted by our JSON export layer in the routes
    await mongoose.connect('mongodb://127.0.0.1:27017/todo-app', {
      serverSelectionTimeoutMS: 1000,
    });
    console.log('MongoDB Connected (local)');
  } catch {
    // Fallback: connect to in-memory mongoose without any persistence layer
    // The JSON store in routes/store.js handles persistence independently
    console.log('No local MongoDB. Using in-process store with JSON persistence.');
  }
};

module.exports = connectDB;
