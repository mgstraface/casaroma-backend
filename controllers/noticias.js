const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const axios = require('axios');
const qs = require('qs');


const { response } = require('express');
const { Noticia } = require('../models');

const obtenerNoticias = async (req, res = response) => {
	try {
		const [total, noticias] = await Promise.all([
			Noticia.countDocuments({ estado: true }),
			Noticia.find({ estado: true }),
		]);

		res.json({
			total,
			noticias,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un problema con la obtención de las noticias',
			error: error.message,
		});
	}
};

const obtenerNoticia = async (req, res = response) => {
	try {
		const id = req.params.id;

		const noticia = await Noticia.findById(id);

		if (!noticia) {
			return res.status(404).json({
				msg: 'Noticia no encontrada',
			});
		}

		res.status(200).json(noticia);
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un problema obteniendo la noticia',
			error: error.message,
		});
	}
};

const crearNoticia = async (req, res = response) => {
	const nuevaNoticia = req.body;

	try {
		const noticia = new Noticia(nuevaNoticia);

		// Guardar en la base de datos
		await noticia.save();

		return res.status(201).json({
			msg: 'Noticia creada con éxito',
			noticia,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Ha ocurrido un error al crear la noticia',
			error: error.message,
		});
	}
};

const crearPostAlFormo = async (req, res = response) => {
	try {
    const googleFormsURL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSea1FWdLmmlT12KCK7DTuVXPGc1VOFeeQZWB5g4iuKWSJz3XQ/formResponse";
    
		const { nombre, email, telefono, mensaje } = req.body;

    // Convertimos los datos a formato URLSearchParams
    const formData = qs.stringify({
      "entry.404694181": nombre,
      "entry.556182997": email,
      "entry.1123217193": telefono,
      "entry.1382592492": mensaje,

    });
		
    // Hacemos la petición al formulario de Google
    const response = await axios.post(
      "https://docs.google.com/forms/u/0/d/e/1FAIpQLSea1FWdLmmlT12KCK7DTuVXPGc1VOFeeQZWB5g4iuKWSJz3XQ/formResponse",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.status(200).send("Formulario enviado con éxito");
		console.log(response)
  } catch (error) {
    console.error("Error al enviar el formulario", error);
    res.status(500).send("Error al enviar el formulario");
  }
}


const actualizarNoticia = async (req, res = response) => {
	try {
		const { id } = req.params;
		const noticiaInfo = req.body;

		const noticiaActual = await Noticia.findById(id);

		if (!noticiaActual) {
			return res.status(404).json({
				msg: 'Noticia no encontrada',
			});
		}

		if (noticiaInfo.imageUrl && noticiaActual.imageUrl !== noticiaInfo.imageUrl) {
			const idImagenArr = noticiaActual.imageUrl.split('/');
			const idImagen = idImagenArr[idImagenArr.length - 1].split('.')[0];

			// Usa la biblioteca Cloudinary para eliminar la imagen anterior
			await cloudinary.uploader.destroy(idImagen);

			// Actualiza la URL de la imagen en la noticia
			noticiaActual.imageUrl = noticiaInfo.imageUrl;
		}

		// Actualiza la noticia en la base de datos
		const noticia = await Noticia.findByIdAndUpdate(id, noticiaInfo, { new: true });

		return res.status(200).json({
			msg: 'Noticia actualizada correctamente',
			noticia,
		});
	} catch (error) {
		return res.status(500).json({
			msg: 'Ocurrió un problema en la actualización de la noticia',
			error: error.message,
		});
	}
};

const eliminarNoticia = async (req, res = response) => {
	try {
		const { id } = req.params;

		const noticiaActual = await Noticia.findById(id);

		if (!noticiaActual) {
			return res.status(404).json({
				msg: 'Noticia no encontrada',
			});
		}

		noticiaActual.estado = false;

		await noticiaActual.save();

		return res.status(200).json({
			msg: 'Noticia eliminada correctamente',
			noticiaActual,
		});
	} catch (error) {
		return res.status(500).json({
			msg: 'Ocurrió un problema en la eliminación de la noticia',
			error: error.message,
		});
	}
};

module.exports = {
	obtenerNoticias,
	obtenerNoticia,
	crearNoticia,
	actualizarNoticia,
	eliminarNoticia,
	crearPostAlFormo
};
