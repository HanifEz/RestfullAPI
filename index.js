const express = require('express');
const pool = require('./app.js');
const port = 3000;
const router = express.Router();
const app = express();

pool.connect((err, res) => {
    console.log(err);
    console.log('connected')
});

app.listen(3000);

//Users
app.get('/users', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM users');
      res.json(rows);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try {
      const { rows } = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
      const { rows } = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rows } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //movies
  app.get('/movies', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM movies');
      res.json(rows);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rows } = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.post('/movies', async (req, res) => {
    const { title, genres, year } = req.body;
    try {
      const { rows } = await pool.query('INSERT INTO movies (title, genres, year) VALUES ($1, $2, $3) RETURNING *', [title, genres, year]);
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.put('/movies/:id', async (req, res) => {
    const { id } = req.params;
    const { title, genres } = req.body;
    try {
      const { rows } = await pool.query('UPDATE movies SET name = $1, title = $2 WHERE genres = $3 RETURNING *', [title, email, id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rows } = await pool.query('DELETE FROM movies WHERE id = $1 RETURNING *', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  //pagination dengan limit 10
  app.get('/users', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    const results = {};
  
    if (endIndex < users.length) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }
  
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }
  
    results.results = users.slice(startIndex, endIndex);
  
    res.json(results);
  });
  








module.exports = router;