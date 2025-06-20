const fs = require('fs');
const path = require('path');
const { db } = require('../firebase/firebaseConfig');
const { subirArchivoFirebase } = require('../services/subirFirebase');

const obtenerProducto = async (req, res) => {
  try {
    const { codigo, referencia } = req.query;

    if (!codigo && !referencia) {
      return res.status(400).json({ error: 'Debes proporcionar el código o la referencia.' });
    }

    let productoQuery = db.collection('productos');
    if (codigo) {
      productoQuery = productoQuery.where('codigo', '==', codigo);
    } else {
      productoQuery = productoQuery.where('referencia', '==', referencia);
    }

    const snapshot = await productoQuery.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const doc = snapshot.docs[0];
    res.status(200).json({ id: doc.id, ...doc.data() });

  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
};

const editarProducto = async (req, res) => {
  try {
    const { codigo, referencia, nombre, contenido, descripcion } = req.body;

    if (!codigo && !referencia) {
      return res.status(400).json({ error: 'Debes proporcionar el código o la referencia.' });
    }

    let productoQuery = db.collection('productos');
    if (codigo) {
      productoQuery = productoQuery.where('codigo', '==', codigo);
    } else {
      productoQuery = productoQuery.where('referencia', '==', referencia);
    }

    const snapshot = await productoQuery.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const doc = snapshot.docs[0];
    const productoRef = db.collection('productos').doc(doc.id);

    // Manejo de imagen
    let nuevaFotoUrl = doc.data().fotoUrl;
    if (req.file) {
      let nombreArchivoAnterior = 'producto_' + doc.id;

      if (nuevaFotoUrl) {
        try {
          const url = new URL(nuevaFotoUrl);
          const partes = url.pathname.split('/');
          nombreArchivoAnterior = decodeURIComponent(partes[partes.length - 1]);
        } catch (e) {
          console.warn('No se pudo extraer el nombre anterior, se usará un nombre por defecto.');
        }
      }

      nuevaFotoUrl = await subirArchivoFirebase(req.file, nombreArchivoAnterior);

      // Eliminar archivo temporal
      fs.unlink(path.resolve(req.file.path), (err) => {
        if (err) console.warn('No se pudo eliminar archivo temporal:', err.message);
      });
    }

    const nuevosDatos = {
      ...(nombre && { nombre }),
      ...(contenido && { contenido }),
      ...(referencia && { referencia }),
      ...(descripcion && { descripcion }),
      fotoUrl: nuevaFotoUrl,
      fechaActualizacion: new Date(),
    };

    await productoRef.update(nuevosDatos);

    res.status(200).json({ message: 'Producto actualizado correctamente.', productoId: doc.id });

  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
};

module.exports = {
  obtenerProducto,
  editarProducto,
};
