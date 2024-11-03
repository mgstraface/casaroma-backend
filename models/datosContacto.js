const { Schema, model } = require('mongoose');

const datosContactoSchema = Schema({
	telefono: {
		type: Number,
		unique: true,
	},
	
	instagram: {
		type: String,
		required:false,
	},
	tiktok: {
		type: String,
		required:false,
	},
	tiendaNube: {
		type: String,
		required:false,
	},
	facebook: {
		type: String,
		required:false,
	},
	correo: {
		type: String,
		required: true,
	}, // Agrega una coma aquí para separar los campos del esquema
});

datosContactoSchema.methods.toJSON = function () {
	const { __v, estado, ...data } = this.toObject();
	return data;
};

module.exports = model('DatosContacto', datosContactoSchema);
