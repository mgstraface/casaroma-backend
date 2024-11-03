const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { Usuario } = require('../models');

//Obtener todos los usuarios
const obtenerUsuarios = async (req, res = response) => {
	const { desde = 0, limit = 8 } = req.query;
	const queryEstado = { estado: true };

	const [total, usuarios] = await Promise.all([
		Usuario.countDocuments(queryEstado),
		Usuario.find(queryEstado).limit(Number(limit)).skip(Number(desde)),
	]);

	res.json({
		total,
		usuarios,
	});
};

// Obtener un usuario mediante el id
const obtenerUsuario = async (req, res = response) => {
	try {
		const id = req.params.id;

		const usuario = await Usuario.findById(id);

		res.status(200).json(usuario);
	} catch (error) {
		console.log(error);
	}
};

//Actualizar un usuario
const actualizarUsuario = async (req, res = response) => {
	const id = req.params.id;
	const { _id, password, google, correo, ...resto } = req.body;

	//TODO validar contra base de datos

	if (password) {
		//Encriptar la contraseña
		const salt = bcryptjs.genSaltSync();
		resto.password = bcryptjs.hashSync(password, salt);
	}

	const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

	res.json({
		msg: 'Datos actualizados correctamente',
		usuario,
	});
};

// crear nuevo usuario
const crearUsuario = async (req, res = response) => {
	try {
		const usuario = req.body;
		const nuevoUsuario = new Usuario(usuario);

		//Encriptar la contraseña
		const salt = bcryptjs.genSaltSync();
		nuevoUsuario.password = bcryptjs.hashSync(nuevoUsuario.password, salt);

		//Guardar en db
		await nuevoUsuario.save();

		res.status(201).json({
			msg: 'Usuario creado con éxito!',
			usuario,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ msg: 'Hubo un problema en la creacion del usuario, revisa los campos' });
	}
};

// eliminar usuario (pasa estado a false)
const eliminarUsuario = async (req, res = response) => {
	const { id } = req.params;

	//Borrado físico
	//const usuario = await Usuario.findByIdAndDelete(id)

	const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });
	res.json({
		msg: 'Usuario eliminado con éxito',
		usuario,
	});
};

// reactivar usuario (pasa estado a true nuevamente)
const reactivarUsuario = async (req, res = response) => {
	const { id } = req.params;

	//Borrado físico
	//const usuario = await Usuario.findByIdAndDelete(id)

	const usuario = await Usuario.findByIdAndUpdate(id, { estado: true }, { new: true });

	res.json({
		msg: 'Cuenta reactivada con éxito',
		usuario,
	});
};

module.exports = {
	obtenerUsuarios,
	obtenerUsuario,
	eliminarUsuario,
	crearUsuario,
	actualizarUsuario,
	reactivarUsuario,
};
