const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Importa ambas rutas con nombres claros
const productosRoutes = require('./routes/productosRoutes');  // para búsqueda, edición, etc.
const productosCrearRoutes = require('./routes/productos');   // para crear productos u otras acciones

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API Inventario funcionando 🚀');
});

// Usar las rutas con diferentes prefijos para no mezclar
app.use('/api/productos', productosCrearRoutes);
app.use('/productos', productosRoutes);

// Si quieres, también puedes eliminar esta última para evitar duplicados:
// app.use('/', productosRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
