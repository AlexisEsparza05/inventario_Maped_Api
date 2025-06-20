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

router.get('/obtener', obtenerProducto);
router.put('/editar', upload.single('foto'), editarProducto);
router.get('/', obtenerTodosLosProductos);
router.get('/:codigo', obtenerProductoPorCodigo);

module.exports = router;
