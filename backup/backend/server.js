import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import slugify from 'slugify';
import bodyParser from 'body-parser';

const ADMIN_PASSWORD = 'Admin';
const PORT = 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '1mb'}));

let db;

async function initDb() {
  db = await open({
    filename: './zplix.sqlite',
    driver: sqlite3.Database
  });
  await db.exec(`CREATE TABLE IF NOT EXISTS apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    keywords TEXT NOT NULL,
    code TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    submitted_at TEXT NOT NULL
  )`);
}

app.post('/api/submit', async (req, res) => {
  const { name, category, keywords, code } = req.body;
  if (!name || !category || !keywords || !code) return res.status(400).json({ error: 'Missing fields' });
  const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now();
  await db.run(
    'INSERT INTO apps (name, category, keywords, code, slug, status, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, category, keywords, code, slug, 'pending', new Date().toISOString()]
  );
  res.json({ ok: true });
});

app.get('/api/pending', async (req, res) => {
  const { admin } = req.query;
  if (admin !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  const apps = await db.all('SELECT * FROM apps WHERE status = "pending" ORDER BY submitted_at DESC');
  res.json(apps);
});

app.get('/api/approved', async (req, res) => {
  const apps = await db.all('SELECT * FROM apps WHERE status = "approved" ORDER BY submitted_at DESC');
  res.json(apps);
});

app.post('/api/approve', async (req, res) => {
  const { id, admin } = req.body;
  if (admin !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  await db.run('UPDATE apps SET status = "approved" WHERE id = ?', [id]);
  res.json({ ok: true });
});

app.post('/api/disapprove', async (req, res) => {
  const { id, admin } = req.body;
  if (admin !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  await db.run('UPDATE apps SET status = "disapproved" WHERE id = ?', [id]);
  res.json({ ok: true });
});

app.delete('/api/remove', async (req, res) => {
  const { id, admin } = req.body;
  if (admin !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  await db.run('DELETE FROM apps WHERE id = ?', [id]);
  res.json({ ok: true });
});

app.get('/apps/:slug', async (req, res) => {
  const appData = await db.get('SELECT * FROM apps WHERE slug = ? AND status = "approved"', [req.params.slug]);
  if (!appData) return res.status(404).send('App not found');
  res.send(`<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>${appData.name} - Zplix App</title></head><body style=\"margin:0;\"><div style=\"max-width:900px;margin:30px auto;padding:18px;box-shadow:0 2px 18px #eee;border-radius:8px;background:#fff;\"><h1 style=\"font-size:1.6em;color:#2563a6;\">${appData.name}</h1><div style=\"color:#888;font-size:0.97em;margin-bottom:12px;\">${appData.category} | ${appData.keywords}</div><div id=\"zplix-app\"></div></div><script>document.getElementById('zplix-app').innerHTML = atob('${Buffer.from(appData.code).toString('base64')}');</script></body></html>`);
});

app.get('/api/app/:slug', async (req, res) => {
  const appData = await db.get('SELECT * FROM apps WHERE slug = ? AND status = "approved"', [req.params.slug]);
  if (!appData) return res.status(404).json({ error: 'Not found' });
  res.json(appData);
});

initDb().then(() => {
  app.listen(PORT, () => console.log('Zplix backend running on port', PORT));
});
