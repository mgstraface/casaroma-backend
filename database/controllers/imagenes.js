const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { Imagen } = require('../models');

const obtenerImagenes = async (req, res = response) => {
	const { tipo } = req.query;

	const [total, imagenes] = await Promise.all([
		Imagen.countDocuments({ tipo: tipo }),
		Imagen.find({ tipo: tipo }),
	]);

	res.json({
		total,
		imagenes,
	});
};

const crearImagen = async (req, res = response) => {
	const data = req.body;

	const imagenDB = await Imagen.findOne({ nombre: data.nombre });

	if (imagenDB) {
		return res.status(400).json({ msg: `La imagen con nombre ${data.nombre} ya existe.` });
	}

	const imagen = new Imagen(data);

	//Guardar en db
	await imagen.save();

	res.status(201).json({
		msg: 'Imagen creada con éxito',
		imagen,
	});
};

const actualizarImagen = async (req, res = response) => {
	const { id } = req.params;
	const { url } = req.query;
	const { descripcion } = req.body;

	const imagen = await Imagen.findById(id);
	try {
		if (url !== undefined && imagen.url) {
			const idImagenArr = imagen.url.split('/');
			const idImagen = idImagenArr[idImagenArr.length - 1].split('.')[0];

			await cloudinary.uploader.destroy(idImagen);
		}
		if (url !== undefined) {
			imagen.url = url;
		}

		if (descripcion) {
			imagen.descripcion = descripcion;
		}

		imagen.save();

		return res.status(200).json({
			msg: 'Imagen actualizada correctamente',
			imagen,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			msg: 'Error al actualizar la imagen',
		});
	}
};

const eliminarImagen = async (req, res = response) => {
	const { url } = req.query;

	if (!url) {
		return res.status(400).json({ msg: 'Debes proporcionar un URL para eliminar la imagen' });
	}

	const idImagen = getImageIdFromUrl(url);

	try {
		await cloudinary.uploader.destroy(idImagen);
		return res.status(200).json({ msg: 'Imagen previa eliminada con éxito' });
	} catch (error) {
		console.error('Error al eliminar la imagen:', error);
		return res.status(500).json({ msg: 'Ocurrió un error al eliminar la imagen' });
	}
};

function getImageIdFromUrl(imageUrl) {
	const urlParts = imageUrl.split('/');
	const imageFileName = urlParts[urlParts.length - 1];
	const imageId = imageFileName.split('.')[0];
	return imageId;
}

module.exports = { eliminarImagen, obtenerImagenes, crearImagen, actualizarImagen };
