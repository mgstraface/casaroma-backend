const { Schema, model } = require('mongoose');

const usuarioSchema = Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
	},
	apellido: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
	},
	dni: {
		type: Number,
	},
	correo: {
		type: String,
		required: [true, 'El correo es obligatorio'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'La contraseña es obligatoria'],
	},
	role: {
		type: String,
		required: true,
		enum: ['SUPERADMIN_ROLE', 'ADMIN_ROLE', 'USER_ROLE'],
	},
	estado: {
		type: Boolean,
		default: true,
	},
});

usuarioSchema.methods.toJSON = function () {
	const { __v, password, ...user } = this.toObject();

	return user;
};

module.exports = model('Usuario', usuarioSchema);
