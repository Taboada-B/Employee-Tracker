const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');

router.get('/department', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM department');
    res.json({
      message: 'success',
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
