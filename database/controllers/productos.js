const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { Producto } = require('../models');

const mongoose = require('mongoose');
// Obtener todos los productos
const obtenerProductos = async (req, res = response) => {
	const { desde = 0, limit = 100, categoria } = req.query; // Añadir 'categoria' al query

	// Crear el query base para productos disponibles (estado: true)
	let queryDisponibles = { estado: true };

	// Si se pasa una categoría como parámetro de consulta, agregarla al query
	if (categoria) {
			queryDisponibles = { ...queryDisponibles, categoria }; // Filtrar por categoría
	}

	let productosQuery = Producto.find(queryDisponibles);

	try {
			const [total, productos] = await Promise.all([
					Producto.countDocuments(queryDisponibles), // Contar productos que cumplan con el query
					productosQuery
							.sort({ precio: 1 }) // Ordenar por precio en orden ascendente (de menor a mayor)
							.limit(Number(limit))
							.skip(Number(desde)) // Aplicar paginación
			]);

			res.status(200).json({
					total,
					productos,
			});
	} catch (error) {
			res.status(500).json({
					msg: 'Error al obtener los productos',
			});
	}
};


// Obtener un producto mediante el id
const obtenerProducto = async (req, res = response) => {
	try {
		const id = req.params.id;

		const producto = await Producto.findById(id);

		res.status(200).json(producto);
	} catch (error) {
		res.status(500).json({ msg: 'Hubo un problema obteniendo el producto' });
	}
};

// crear un producto
const crearProducto = async (req, res = response) => {
	const nuevoProducto = req.body;

	const nombreProducto = nuevoProducto.nombre.toUpperCase();

	const productoDB = await Producto.findOne({ nombre: nombreProducto });

	if (productoDB) {
		return res.status(400).json({ msg: `El producto ${productoDB.nombre} ya existe.` });
	}
	try {
		const data = {
			...nuevoProducto,
			nombre: nuevoProducto.nombre.toUpperCase(),
		};

		const producto = new Producto(data);

		//Guardar en db
		await producto.save();

		return res.status(201).json({
			msg: 'Producto creado con éxito',
			producto,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Ha ocurrido un error. Quizás estás intentando crear un producto que ya existe.',
		});
	}
};

// actualizar un producto

const actualizarProducto = async (req, res = response) => {
	try {
		const { id } = req.params;
		const productoAactualizar = req.body;

		if (productoAactualizar.nombre) {
			productoAactualizar.nombre = productoAactualizar.nombre.toUpperCase();
		}

		const productoActual = await Producto.findById(id);

		if (productoAactualizar.logo && productoActual.logo !== productoAactualizar.logo) {
			const idImagenArr = productoActual.logo.split('/');
			const idImagen = idImagenArr[idImagenArr.length - 1].split('.')[0];

			// Usa la biblioteca Cloudinary para eliminar la imagen anterior
			await cloudinary.uploader.destroy(idImagen);

			// Actualiza la URL y el texto de la imagen en el producto
			productoActual.logo = productoAactualizar.logo;
		}

		if (productoAactualizar.imagenes && Array.isArray(productoAactualizar.imagenes)) {
			for (const [index, imagenActual] of productoActual.imagenes.entries()) {
				const imagenActualObjectId = new mongoose.Types.ObjectId(imagenActual._id);
				// Busca la imagen correspondiente por su ID en la solicitud
				const imagenSolicitud = productoAactualizar.imagenes.find(
					(imagen) => imagen._id === imagenActualObjectId.toString()
				);
				if (imagenSolicitud && imagenSolicitud.url !== imagenActual.url) {
					// Si se encuentra una imagen con el mismo ID y URL diferente, elimina la imagen anterior en Cloudinary
					const idImagenArr = imagenActual.url.split('/');
					const idImagen = idImagenArr[idImagenArr.length - 1].split('.')[0];

					// Usa la biblioteca Cloudinary para eliminar la imagen anterior
					await cloudinary.uploader.destroy(idImagen);

					// Actualiza la URL y el texto de la imagen en el producto
					productoActual.imagenes[index].url = imagenSolicitud.url;
					productoActual.imagenes[index].texto = imagenSolicitud.texto;
				}
			}
		}

		// Actualiza el producto en la base de datos
		const producto = await Producto.findByIdAndUpdate(id, productoAactualizar, {
			new: true,
		});

		return res.status(201).json({
			msg: 'Producto actualizado correctamente',
			producto,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ msg: 'Ocurrió un problema en la actualización del producto', error });
	}
};

const eliminarProducto = async (req, res = response) => {
	const { id } = req.params;

	// const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true }).populate(
	// 	'usuario',
	// 	'nombre'
	// );
	try {
		const productoEliminado = await Producto.findByIdAndDelete(id);
		res.status(200).json({
			msg: 'Producto eliminado con éxito',
			productoEliminado,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	obtenerProductos,
	obtenerProducto,
	crearProducto,
	actualizarProducto,
	eliminarProducto,
};
