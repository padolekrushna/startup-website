const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read/write DB (simple file-based JSON)
async function readDB() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { items: [] };
  }
}
async function writeDB(data) {
  await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// API: status
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// API: get items
app.get('/api/items', async (req, res) => {
  const db = await readDB();
  res.json(db.items || []);
});

// API: add item
app.post('/api/items', async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'name and message required' });
  }
  const db = await readDB();
  const newItem = {
    id: Date.now().toString(),
    name,
    message,
    created_at: new Date().toISOString()
  };
  db.items = db.items || [];
  db.items.unshift(newItem);
  await writeDB(db);
  res.status(201).json(newItem);
});

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
