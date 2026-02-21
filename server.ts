import express from 'express';
import { createServer as createViteServer } from 'vite';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Database setup
  const db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    );
    CREATE TABLE IF NOT EXISTS journals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      content TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id)
    );
  `);

  // Middleware to verify JWT
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // API Routes
  app.post('/api/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
      const token = jwt.sign({ id: result.lastID, email }, SECRET_KEY);
      res.json({ token, user: { id: result.lastID, email } });
    } catch (error) {
      res.status(400).json({ error: 'Email already exists' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);
    res.json({ token, user: { id: user.id, email: user.email } });
  });

  app.get('/api/journals', authenticateToken, async (req: any, res) => {
    const journals = await db.all('SELECT * FROM journals WHERE userId = ? ORDER BY timestamp DESC', [req.user.id]);
    res.json(journals);
  });

  app.post('/api/journals', authenticateToken, async (req: any, res) => {
    const { content } = req.body;
    const result = await db.run('INSERT INTO journals (userId, content) VALUES (?, ?)', [req.user.id, content]);
    const newJournal = await db.get('SELECT * FROM journals WHERE id = ?', [result.lastID]);
    res.json(newJournal);
  });

  app.delete('/api/journals/:id', authenticateToken, async (req: any, res) => {
    const { id } = req.params;
    await db.run('DELETE FROM journals WHERE id = ? AND userId = ?', [id, req.user.id]);
    res.json({ message: 'Deleted' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
