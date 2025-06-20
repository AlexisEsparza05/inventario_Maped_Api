const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {db} = require('../firebase/firebaseConfig');
const { bucket } = require('../firebase/firebaseConfig');

const { subirArchivoFirebase } = require('../services/subirFirebase');

router.post('/', upload.single('foto'), async (req, res) => {
  try {
    const { codigo, nombre, referencia, descripcion, contenido } = req.body;

    // Validar que código y referencia no estén vacíos
    if (!codigo || !referencia) {
      return res.status(400).json({ error: 'El código y la referencia son obligatorios.' });
    }

    // Verificar si ya existe un producto con ese código
    const codigoSnapshot = await db.collection('productos').where('codigo', '==', codigo).get();
    if (!codigoSnapshot.empty) {
      return res.status(400).json({ error: 'Ya existe un producto con ese código.' });
    }

    // Verificar si ya existe un producto con esa referencia
    const referenciaSnapshot = await db.collection('productos').where('referencia', '==', referencia).get();
    if (!referenciaSnapshot.empty) {
      return res.status(400).json({ error: 'Ya existe un producto con esa referencia.' });
    }

    let imagenUrl = null;

if (req.file) {
  imagenUrl = await subirArchivoFirebase(req.file);
}


    const nuevoProducto = {
      codigo,
      nombre,
      referencia,
      descripcion: descripcion || '',
      contenido,
      fotoUrl: imagenUrl,
      fecha: new Date(),
    };

    await db.collection('productos').add(nuevoProducto);

    res.status(200).json({ message: 'Producto guardado correctamente.' });
  } catch (error) {
    console.error('Error al guardar el producto:', error);
    res.status(500).json({ error: 'Error al guardar el producto.' });
  }
});


module.exports = router;
