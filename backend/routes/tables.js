const express = require('express');
const router = express.Router();
const db = require('../db'); // adjust path as needed

// GET all tables
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM tables');
  res.json(rows);
});

// CREATE table
router.post('/', async (req, res) => {
  try {
    const { name, capacity, status, layout_x, layout_y, branch_id } = req.body;
    if (!name || isNaN(Number(capacity))) {
      return res.status(400).json({ message: 'Name and numeric capacity are required' });
    }
    const cap = parseInt(capacity, 10);
    const lx = layout_x !== undefined ? parseInt(layout_x, 10) : 0;
    const ly = layout_y !== undefined ? parseInt(layout_y, 10) : 0;
    await db.query(
      'INSERT INTO tables (name, capacity, status, layout_x, layout_y, branch_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, cap, status || 'Available', lx, ly, branch_id || null]
    );
    res.status(201).json({ message: 'Table created' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE table
router.put('/:id', async (req, res) => {
  const { name, capacity, status, layout_x, layout_y, branch_id } = req.body;
  await db.query('UPDATE tables SET name=?, capacity=?, status=?, layout_x=?, layout_y=?, branch_id=? WHERE id=?', [name, capacity, status, layout_x, layout_y, branch_id, req.params.id]);
  res.json({ message: 'Table updated' });
});

// DELETE table
router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM tables WHERE id=?', [req.params.id]);
  res.json({ message: 'Table deleted' });
});

// ASSIGN table by party size
router.post('/assign', async (req, res) => {
  const { partySize } = req.body;
  const [rows] = await db.query('SELECT * FROM tables WHERE status="Available" AND capacity >= ? ORDER BY capacity ASC LIMIT 1', [partySize]);
  if (rows.length === 0) return res.status(404).json({ message: 'No available table' });
  // Optionally update status to Reserved here
  res.json(rows[0]);
});

// UPDATE table status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  await db.query('UPDATE tables SET status=? WHERE id=?', [status, req.params.id]);
  res.json({ message: 'Status updated' });
});

module.exports = router;