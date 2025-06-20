const express = require('express');
const router = express.Router();

const {
  crearInventario,
  obtenerInventarios,
  obtenerInventarioPorCampoId,
  obtenerInventariosPaginados,
  editarNombreInventario,
  eliminarInventario
} = require('../controllers/inventariosController');

// Crear o actualizar un inventario
router.post('/', crearInventario);

// Obtener todos los inventarios
router.get('/', obtenerInventarios);

// Obtener inventario por ID de campo (campoId)
router.get('/:id', obtenerInventarioPorCampoId);

// Obtener inventarios paginados (por nombre)
router.get('/paginar', obtenerInventariosPaginados);

// Editar el nombre de una tabla (inventario)
router.put('/:id', editarNombreInventario);

// Eliminar una tabla (inventario)
router.delete('/:id', eliminarInventario);

module.exports = router;
