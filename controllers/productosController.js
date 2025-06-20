const { db } = require('../firebase/firebaseConfig');

const obtenerProductoPorCodigo = async (req, res) => {
  const { codigo } = req.params;

  try {
    const snapshot = await db.collection('productos').where('codigo', '==', codigo).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const producto = snapshot.docs[0].data();
  res.status(200).json({ producto });
  } catch (error) {
    console.error('Error al buscar el producto:', error);
    res.status(500).json({ error: 'Error al buscar el producto' });
  }
};

const obtenerTodosLosProductos = async (req, res) => {
  try {
    const snapshot = await db.collection('productos').get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'No hay productos disponibles' });
    }

    // Convierte todos los documentos en un array con id y datos
    const productos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(productos); // regresa lista de productos
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};



module.exports = {
  obtenerProductoPorCodigo,
  obtenerTodosLosProductos,

};
