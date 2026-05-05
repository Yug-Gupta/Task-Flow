const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Users } = require('../store');
const { protect } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'todo-secret-key-2024';

const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  preferences: user.preferences || { theme: 'light' },
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  if (Users.findByEmail(email))
    return res.status(400).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = Users.create({ name, email, password: hashed, preferences: { theme: 'light' } });

  res.status(201).json({ ...sanitizeUser(user), token: generateToken(user.id) });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = Users.findByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid email or password' });

  res.json({ ...sanitizeUser(user), token: generateToken(user.id) });
});

// GET /api/auth/profile
router.get('/profile', protect, (req, res) => {
  res.json(sanitizeUser(req.user));
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  const { name, password, preferences } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (preferences) updates.preferences = preferences;
  if (password) updates.password = await bcrypt.hash(password, 10);

  const updated = Users.update(req.user.id, updates);
  res.json({ ...sanitizeUser(updated), token: generateToken(updated.id) });
});

module.exports = router;
