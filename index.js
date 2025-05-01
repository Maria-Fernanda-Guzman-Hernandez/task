// index.js
const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const Task = require('./models/Task');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// RUTAS
app.get('/tasks', async (req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
});

app.get('/tasks/:id', async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
  res.json(task);
});

app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'El título es obligatorio' });
  const task = await Task.create({ title, description });
  res.status(201).json(task);
});

app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
  const { title, description, completed } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = completed;
  await task.save();
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
  await task.destroy();
  res.status(204).send();
});

// Middleware 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Sincronizar y arrancar
sequelize.sync().then(() => {
  app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
});
