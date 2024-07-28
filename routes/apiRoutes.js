const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');

router.get('/department', async (req, res) => {
  try {
    const sql = 'SELECT * FROM department';
    const { rows } = await pool.query(sql);
    res.json({
      message: 'success',
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
