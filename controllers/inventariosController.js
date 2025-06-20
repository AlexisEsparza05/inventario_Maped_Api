// controllers/inventariosController.js
const { db } = require('../firebase/firebaseConfig');

// Crear o actualizar un inventario
const crearInventario = async (req, res) => {
  try {
    const nuevoInventario = req.body;
    const campoId = req.body.campoId;

    if (!nuevoInventario.nombre || !Array.isArray(nuevoInventario.productos)) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: nombre y productos' });
    }

    for (const prod of nuevoInventario.productos) {
      if (
        !prod.codigo ||
        !prod.contenido ||
        prod.descripcion === undefined ||
        !prod.fotoUrl ||
        !prod.nombre ||
        !prod.referencia
      ) {
        return res.status(400).json({ error: 'Un producto no tiene todas las propiedades requeridas' });
      }
    }

    if ('idTablaActual' in nuevoInventario) {
      delete nuevoInventario.idTablaActual;
    }

    if (campoId) {
      const snapshot = await db.collection('inventarios').where('id', '==', campoId).get();
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        const { id, ...inventarioSinId } = nuevoInventario;
        await docRef.update(inventarioSinId);
        return res.status(200).json({ id: docRef.id, ...inventarioSinId, actualizado: true });
      } else {
        const docRef = await db.collection('inventarios').add({ ...nuevoInventario, id: campoId });
        return res.status(201).json({ id: docRef.id, ...nuevoInventario, creado: true });
      }
    } else {
      const snapshot = await db.collection('inventarios').where('nombre', '==', nuevoInventario.nombre).get();
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        const { id, ...inventarioSinId } = nuevoInventario;
        await docRef.update(inventarioSinId);
        return res.status(200).json({ id: docRef.id, ...inventarioSinId, actualizado: true });
      } else {
        const docRef = await db.collection('inventarios').add(nuevoInventario);
        return res.status(201).json({ id: docRef.id, ...nuevoInventario, creado: true });
      }
    }
  } catch (error) {
    console.error('Error al crear o actualizar inventario:', error);
    res.status(500).json({ error: 'Error al crear o actualizar el inventario' });
  }
};

// Obtener todos los inventarios (sin paginación)
const obtenerInventarios = async (req, res) => {
  try {
    const snapshot = await db.collection('inventarios').get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'No hay inventarios disponibles' });
    }

    const inventarios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(inventarios);
  } catch (error) {
    console.error('Error al obtener inventarios:', error);
    res.status(500).json({ error: 'Error al obtener inventarios' });
  }
};

const obtenerInventarioPorCampoId = async (req, res) => {
  try {
    const { id } = req.params;
    const snapshot = await db.collection('inventarios').where('id', '==', id).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Inventario no encontrado' });
    }

    const inventarioDoc = snapshot.docs[0];
    res.status(200).json({ id: inventarioDoc.id, ...inventarioDoc.data() });
  } catch (error) {
    console.error('Error al obtener inventario por campo id:', error);
    res.status(500).json({ error: 'Error al obtener inventario por campo id' });
  }
};

const obtenerInventariosPaginados = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;

    const snapshot = await db.collection('inventarios')
      .orderBy('nombre')
      .offset(page * limit)
      .limit(limit)
      .get();

    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().nombre || 'Sin nombre',
    }));

    res.status(200).json({ items });
  } catch (error) {
    console.error('Error al obtener inventarios paginados:', error);
    res.status(500).json({ error: 'Error al obtener inventarios paginados' });
  }
};

const editarNombreInventario = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nuevo nombre es obligatorio' });
    }

    const docRef = db.collection('inventarios').doc(id);
    await docRef.update({ nombre: name });

    res.status(200).json({ id, name, actualizado: true });
  } catch (error) {
    console.error('Error al editar nombre:', error);
    res.status(500).json({ error: 'Error al editar el nombre del inventario' });
  }
};

const eliminarInventario = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('inventarios').doc(id).delete();
    res.status(200).json({ eliminado: true });
  } catch (error) {
    console.error('Error al eliminar inventario:', error);
    res.status(500).json({ error: 'Error al eliminar inventario' });
  }
};

module.exports = {
  crearInventario,
  obtenerInventarios,
  obtenerInventarioPorCampoId,
  obtenerInventariosPaginados,
  editarNombreInventario,
  eliminarInventario,
};