const { response } = require('express');
const { DatosContacto } = require('../models');

// Obtener todos los datos de contacto
const obtenerDatosContacto = async (req, res = response) => {
	try {
		const datosContacto = await DatosContacto.find();
		res.status(200).json(datosContacto);
	} catch (error) {
		res.status(500).json({ msg: 'Hubo un problema obteniendo los datos de contacto' });
	}
};

// Obtener un dato de contacto mediante el id
const obtenerDatoContacto = async (req, res = response) => {
	try {
		const id = req.params.id;
		const datoContacto = await DatosContacto.findById(id);
		res.status(200).json(datoContacto);
	} catch (error) {
		res.status(500).json({ msg: 'Hubo un problema obteniendo el dato de contacto' });
	}
};

// Crear un dato de contacto
const crearDatoContacto = async (req, res = response) => {
	const nuevoDatoContacto = req.body;
	try {
		const datoContacto = new DatosContacto(nuevoDatoContacto);
		await datoContacto.save();
		return res.status(201).json({
			msg: 'Dato de contacto creado con éxito',
			datoContacto,
		});
	} catch (error) {
		return res.status(500).json({
			msg: 'Ha ocurrido un error al crear el dato de contacto',
		});
	}
};

// Actualizar un dato de contacto
const actualizarDatoContacto = async (req, res = response) => {
	try {
		const { id } = req.params;
		const datoContactoActualizado = req.body;
		const datoContacto = await DatosContacto.findByIdAndUpdate(id, datoContactoActualizado, {
			new: true,
		});
		return res.status(201).json({
			msg: 'Dato de contacto actualizado correctamente',
			datoContacto,
		});
	} catch (error) {
		return res.status(500).json({
			msg: 'Ocurrió un problema en la actualización del dato de contacto',
		});
	}
};

// Eliminar un dato de contacto
const eliminarDatoContacto = async (req, res = response) => {
	const { id } = req.params;
	try {
		const datoContactoEliminado = await DatosContacto.findByIdAndDelete(id);
		res.status(200).json({
			msg: 'Dato de contacto eliminado con éxito',
			datoContactoEliminado,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: 'Ocurrió un problema al eliminar el dato de contacto',
		});
	}
};

module.exports = {
	obtenerDatosContacto,
	obtenerDatoContacto,
	crearDatoContacto,
	actualizarDatoContacto,
	eliminarDatoContacto,
};
