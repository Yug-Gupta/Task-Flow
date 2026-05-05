const jwt = require('jsonwebtoken');
const { Users } = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'todo-secret-key-2024';

const protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = Users.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
