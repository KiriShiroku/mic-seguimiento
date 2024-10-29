const express = require('express');
const path = require('path');
const { db } = require('./firebase-config'); // Importa la configuración de Firebase

const app = express();
const port = 8093;

// Middleware para parsear JSON
app.use(express.json());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname))); // Servir archivos en la carpeta del microservicio

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Sirve el archivo HTML
});

// Obtener registros de seguimiento
app.get('/lista-seguimiento', async (req, res) => {
  try {
    const seguimientoRecords = await db.collection('seguimiento').get(); // Colección específica para Seguimiento
    const items = seguimientoRecords.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Incluye ID del documento
    res.status(200).json({ data: { items } });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los datos', error: error.message });
  }
});

// Agregar un nuevo registro de seguimiento
app.post('/agregar-seguimiento', async (req, res) => {
  try {
    const nuevoSeguimiento = req.body; // El cuerpo de la solicitud debe contener los datos del seguimiento
    const docRef = await db.collection('seguimiento').add(nuevoSeguimiento);
    res.status(201).json({ id: docRef.id, ...nuevoSeguimiento });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el seguimiento', error: error.message });
  }
});

app.listen(port, () => {
  console.log('Microservicio Seguimiento escuchando en localhost:' + port);
});
