import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'stuber',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Routes

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email FROM users ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    
    // Provide more specific error messages
    if (error.code === '3D000') {
      return res.status(500).json({ 
        error: 'Database does not exist. Please run the database setup scripts first.' 
      });
    }
    if (error.code === '28P01') {
      return res.status(500).json({ 
        error: 'Database authentication failed. Please check your .env file credentials.' 
      });
    }
    if (error.code === '42P01') {
      return res.status(500).json({ 
        error: 'Users table does not exist. Please run the schema.sql script.' 
      });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    
    // Provide more specific error messages
    if (error.code === '3D000') {
      return res.status(500).json({ 
        error: 'Database does not exist. Please run the database setup scripts first.' 
      });
    }
    if (error.code === '28P01') {
      return res.status(500).json({ 
        error: 'Database authentication failed. Please check your .env file credentials.' 
      });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update username
app.put('/api/users/:id/username', async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    
    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    const result = await pool.query(
      'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, email',
      [username.trim(), id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating username:', error);
    
    // Provide more specific error messages
    if (error.code === '3D000') {
      return res.status(500).json({ 
        error: 'Database does not exist. Please run the database setup scripts first.' 
      });
    }
    if (error.code === '28P01') {
      return res.status(500).json({ 
        error: 'Database authentication failed. Please check your .env file credentials.' 
      });
    }
    if (error.code === '42P01') {
      return res.status(500).json({ 
        error: 'Users table does not exist. Please run the schema.sql script.' 
      });
    }
    
    // Check for unique constraint violation
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
