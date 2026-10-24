const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'apiuser',
  database: process.env.DB_NAME || 'apidb',
  password: process.env.DB_PASSWORD,
});

const idValido = (v) => Number.isInteger(Number(v)) && Number(v) > 0;
const datosValidos = (b) =>
  typeof b.nombre === 'string' && b.nombre.trim() !== '' &&
  typeof b.precio === 'number' && b.precio >= 0;

app.get('/salud', async (req, res) => {
  await pool.query('SELECT 1');
  res.json({ estado: 'ok', base_de_datos: 'conectada' });
});

app.get('/productos', async (req, res) => {
  const r = await pool.query('SELECT * FROM productos ORDER BY id');
  res.json(r.rows);
});

app.get('/productos/:id', async (req, res) => {
  if (!idValido(req.params.id)) return res.status(400).json({ error: 'id invalido' });
  const r = await pool.query('SELECT * FROM productos WHERE id = $1', [req.params.id]);
  if (r.rowCount === 0) return res.status(404).json({ error: 'no encontrado' });
  res.json(r.rows[0]);
});

app.post('/productos', async (req, res) => {
  if (!datosValidos(req.body)) return res.status(400).json({ error: 'nombre (texto) y precio (numero >= 0) son obligatorios' });
  const r = await pool.query(
    'INSERT INTO productos (nombre, precio) VALUES ($1, $2) RETURNING *',
    [req.body.nombre.trim(), req.body.precio]);
  res.status(201).json(r.rows[0]);
});

app.put('/productos/:id', async (req, res) => {
  if (!idValido(req.params.id)) return res.status(400).json({ error: 'id invalido' });
  if (!datosValidos(req.body)) return res.status(400).json({ error: 'nombre (texto) y precio (numero >= 0) son obligatorios' });
  const r = await pool.query(
    'UPDATE productos SET nombre = $1, precio = $2 WHERE id = $3 RETURNING *',
    [req.body.nombre.trim(), req.body.precio, req.params.id]);
  if (r.rowCount === 0) return res.status(404).json({ error: 'no encontrado' });
  res.json(r.rows[0]);
});

app.delete('/productos/:id', async (req, res) => {
  if (!idValido(req.params.id)) return res.status(400).json({ error: 'id invalido' });
  const r = await pool.query('DELETE FROM productos WHERE id = $1', [req.params.id]);
  if (r.rowCount === 0) return res.status(404).json({ error: 'no encontrado' });
  res.status(204).end();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'error interno' });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '127.0.0.1', () => console.log('API escuchando en 127.0.0.1:' + PORT));
