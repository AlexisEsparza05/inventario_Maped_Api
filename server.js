const express = require('express');
const cors = require('cors');
const app = express();

const inventariosRoutes = require('./routes/inventariosRoutes');
const productosRoutes = require('./routes/productosRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('API Inventario funcionando 🚀');
});

app.use('/api/inventario', inventariosRoutes);
app.use('/api/productos', productosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
