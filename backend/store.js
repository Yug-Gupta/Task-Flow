/**
 * store.js — Persistent JSON File Store
 * This replaces MongoDB entirely for local development.
 * All data is persisted to backend/data.json so it survives server restarts.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_FILE = path.join(__dirname, 'data.json');

const defaultData = { users: [], tasks: [] };

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return defaultData;
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

// --- Users ---
const Users = {
  findByEmail: (email) => {
    const db = readData();
    return db.users.find(u => u.email === email) || null;
  },
  findById: (id) => {
    const db = readData();
    return db.users.find(u => u.id === id) || null;
  },
  create: (userData) => {
    const db = readData();
    const user = { id: generateId(), createdAt: new Date().toISOString(), ...userData };
    db.users.push(user);
    writeData(db);
    return user;
  },
  update: (id, updates) => {
    const db = readData();
    const idx = db.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    db.users[idx] = { ...db.users[idx], ...updates };
    writeData(db);
    return db.users[idx];
  }
};

// --- Tasks ---
const Tasks = {
  findByUser: (userId) => {
    const db = readData();
    return db.tasks
      .filter(t => t.userId === userId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },
  findById: (id) => {
    const db = readData();
    return db.tasks.find(t => t.id === id) || null;
  },
  create: (taskData) => {
    const db = readData();
    const task = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCompleted: false,
      status: 'inbox',
      priority: 'medium',
      category: 'Inbox',
      tags: [],
      subtasks: [],
      order: db.tasks.filter(t => t.userId === taskData.userId).length,
      ...taskData,
    };
    db.tasks.push(task);
    writeData(db);
    return task;
  },
  update: (id, updates) => {
    const db = readData();
    const idx = db.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    db.tasks[idx] = { ...db.tasks[idx], ...updates, updatedAt: new Date().toISOString() };
    writeData(db);
    return db.tasks[idx];
  },
  delete: (id) => {
    const db = readData();
    const idx = db.tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;
    db.tasks.splice(idx, 1);
    writeData(db);
    return true;
  },
  batchUpdate: (updates) => {
    const db = readData();
    updates.forEach(({ id, ...fields }) => {
      const idx = db.tasks.findIndex(t => t.id === id);
      if (idx !== -1) db.tasks[idx] = { ...db.tasks[idx], ...fields, updatedAt: new Date().toISOString() };
    });
    writeData(db);
    return db.tasks;
  }
};

module.exports = { Users, Tasks, generateId };
