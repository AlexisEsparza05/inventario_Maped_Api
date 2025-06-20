const { db } = require('../firebase/firebaseConfig');

// Crear o actualizar un inventario
const crearInventario = async (req, res) => {
    try {
        const nuevoInventario = req.body;
        const campoId = req.body.campoId; // Recibe el id del campo de tablas

        if (!nuevoInventario.nombre || !Array.isArray(nuevoInventario.productos)) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre y productos' });
        }

        // Validar que cada producto tenga las propiedades requeridas
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

        // Eliminar idTablaActual si existe en el objeto recibido
        if ('idTablaActual' in nuevoInventario) {
            delete nuevoInventario.idTablaActual;
        }

        if (campoId) {
            // Si se proporciona campoId, buscar por ese campo
            const snapshot = await db.collection('inventarios').where('id', '==', campoId).get();
            if (!snapshot.empty) {
                // Si existe, actualiza el primero encontrado sin cambiar el id
                const docRef = snapshot.docs[0].ref;
                // No modificar el campo 'id' al actualizar
                const { id, ...inventarioSinId } = nuevoInventario;
                await docRef.update(inventarioSinId);
                return res.status(200).json({ id: docRef.id, ...inventarioSinId, actualizado: true });
            } else {
                // Si no existe, crea uno nuevo con el campoId como id
                const docRef = await db.collection('inventarios').add({ ...nuevoInventario, id: campoId });
                return res.status(201).json({ id: docRef.id, ...nuevoInventario, creado: true });
            }
        } else {
            // Si no se proporciona campoId, buscar por nombre
            const snapshot = await db.collection('inventarios').where('nombre', '==', nuevoInventario.nombre).get();
            if (!snapshot.empty) {
                // Si existe, actualiza el primero encontrado sin cambiar el id
                const docRef = snapshot.docs[0].ref;
                const { id, ...inventarioSinId } = nuevoInventario;
                await docRef.update(inventarioSinId);
                return res.status(200).json({ id: docRef.id, ...inventarioSinId, actualizado: true });
            } else {
                // Si no existe, crea uno nuevo
                const docRef = await db.collection('inventarios').add(nuevoInventario);
                return res.status(201).json({ id: docRef.id, ...nuevoInventario, creado: true });
            }
        }
    } catch (error) {
        console.error('Error al crear o actualizar inventario:', error);
        res.status(500).json({ error: 'Error al crear o actualizar el inventario' });
    }
};


// Obtener todos los inventarios
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

    // Como puede haber más de uno, devolvemos el primero
    const inventarioDoc = snapshot.docs[0];
    res.status(200).json({ id: inventarioDoc.id, ...inventarioDoc.data() });
  } catch (error) {
    console.error('Error al obtener inventario por campo id:', error);
    res.status(500).json({ error: 'Error al obtener inventario por campo id' });
  }
};




module.exports = {
  crearInventario,
  obtenerInventarios,
  obtenerInventarioPorCampoId,

};
