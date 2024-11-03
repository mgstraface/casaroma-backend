const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT, verificarGoogle } = require('../helpers');

const login = async (req, res = response) => {
	const { name, password } = req.body;

	try {
		//Verificar si existe el e-mail
		const usuario = await Usuario.findOne({ name });
		if (!usuario) {
			return res.status(400).send({
				msg: `El usuario ${name} no está registrado.`,
			});
		}

		//Verificar si el usuario está activo
		if (usuario.estado === false) {
			return res.status(400).send({
				msg: `El usuario no se encuentra activo.`,
			});
		}

		//Verificar la contraseña
		const validPassword = bcryptjs.compareSync(password, usuario.password);
		if (!validPassword) {
			return res.status(400).send({
				msg: 'La contraseña no coincide.',
			});
		}

		//Generar el JWT

		const token = await generarJWT(usuario._id);

		res.json({
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			msg: 'Comuníquese con el administrador.',
		});
	}
};

const loginGoogle = async (req, res = response) => {
	const { id_token } = req.body;

	try {
		const { correo, nombre, number } = await verificarGoogle(id_token);
		let usuario = await Usuario.findOne({ correo });

		if (!usuario) {
			// Tengo que crearlo
			const data = {
				nombre: nombre.split(' ')[0],
				apellido: nombre.split(' ')[1] ? nombre.split(' ')[1] : ' ',
				correo,
				password: ':P',
				google: true,
				role: 'USER_ROLE',
				dni: number,
			};

			usuario = new Usuario(data);

			await usuario.save();
		}

		// Si el usuario en DB
		if (!usuario.estado) {
			return res.status(401).json({
				msg: 'Hable con el administrador, usuario inactivo',
			});
		}

		// Generar el JWT
		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error,
		});
	}
};

module.exports = {
	login,
	loginGoogle
};
