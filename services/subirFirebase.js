const { bucket } = require('../firebase/firebaseConfig');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

async function subirArchivoFirebase(file, nombrePersonalizado = null) {
  return new Promise((resolve, reject) => {
    // Ruta temporal del archivo subido
    const filePath = path.join(__dirname, '..', file.path);

    // Si se pasa un nombre personalizado, úsalo para sobrescribir la imagen,
    // si no, genera un nombre único para evitar duplicados
    const nombreArchivo = nombrePersonalizado 
      ? nombrePersonalizado 
      : `${uuidv4()}_${file.originalname}`;

    // Carpeta destino en Firebase Storage
    const destination = `productos/${nombreArchivo}`;

    // Generar token para acceso público
    const token = uuidv4();

    // Subir archivo a Firebase Storage
    bucket.upload(filePath, {
      destination,
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: token,
        },
      },
    }, (err, uploadedFile) => {
      // Borrar el archivo temporal local
      fs.unlink(filePath, () => {});

      if (err) {
        reject(err);
      } else {
        // Construir URL pública para la imagen
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media&token=${token}`;
        resolve(publicUrl);
      }
    });
  });
}

module.exports = { subirArchivoFirebase };
