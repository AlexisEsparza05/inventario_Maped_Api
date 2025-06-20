const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  obtenerProducto,
  editarProducto
} = require('../controllers/editController');

const {
  obtenerProductoPorCodigo,
  obtenerTodosLosProductos
} = require('../controllers/productosController');

const {
  crearInventario,
  obtenerInventarios,
  obtenerInventarioPorCampoId,
  obtenerInventariosPaginados,
  editarNombreInventario,
  eliminarInventario
} = require('../controllers/inventariosController');

// ------------------- RUTAS DE INVENTARIOS (Tablas) -------------------

// Crear o actualizar un inventario
router.post('/inventario', crearInventario);

// Obtener todos los inventarios
router.get('/inventario', obtenerInventarios);

// Obtener inventario por ID de campo (campoId)
router.get('/inventario/:id', obtenerInventarioPorCampoId);

// Obtener inventarios paginados (por nombre)
router.get('/tablas', obtenerInventariosPaginados);

// Editar el nombre de una tabla (inventario)
router.put('/tablas/:id', editarNombreInventario);

// Eliminar una tabla (inventario)
router.delete('/tablas/:id', eliminarInventario);

// ------------------- RUTAS DE PRODUCTOS -------------------

router.get('/obtener', obtenerProducto);
router.put('/editar', upload.single('foto'), editarProducto);
router.get('/', obtenerTodosLosProductos);
router.get('/:codigo', obtenerProductoPorCodigo);

module.exports = router;
