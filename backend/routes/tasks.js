const express = require('express');
const router = express.Router();
const { Tasks } = require('../store');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/tasks
router.get('/', (req, res) => {
  const tasks = Tasks.findByUser(req.user.id);
  res.json(tasks);
});

// POST /api/tasks
router.post('/', (req, res) => {
  const { title, description, dueDate, priority, category, status, tags, subtasks } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const task = Tasks.create({
    userId: req.user.id,
    title,
    description: description || '',
    dueDate: dueDate || null,
    priority: priority || 'medium',
    category: category || 'Inbox',
    status: status || 'inbox',
    tags: tags || [],
    subtasks: subtasks || [],
  });
  res.status(201).json(task);
});

// PUT /api/tasks/reorder/batch — must be before /:id
router.put('/reorder/batch', (req, res) => {
  const { tasks } = req.body;
  if (!Array.isArray(tasks)) return res.status(400).json({ message: 'Tasks array required' });

  // Validate ownership
  const validUpdates = tasks
    .map(t => Tasks.findById(t.id))
    .filter(t => t && t.userId === req.user.id)
    .map((t, i) => ({ id: t.id, order: tasks.find(u => u.id === t.id)?.order ?? i, category: tasks.find(u => u.id === t.id)?.category ?? t.category, status: tasks.find(u => u.id === t.id)?.status ?? t.status }));

  Tasks.batchUpdate(validUpdates);
  res.json(Tasks.findByUser(req.user.id));
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  const task = Tasks.findById(req.params.id);
  if (!task || task.userId !== req.user.id)
    return res.status(404).json({ message: 'Task not found' });

  const allowed = ['title', 'description', 'isCompleted', 'dueDate', 'priority', 'category', 'status', 'tags', 'subtasks', 'order'];
  const updates = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

  const updated = Tasks.update(req.params.id, updates);
  res.json(updated);
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const task = Tasks.findById(req.params.id);
  if (!task || task.userId !== req.user.id)
    return res.status(404).json({ message: 'Task not found' });

  Tasks.delete(req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;
