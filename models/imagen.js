const { Schema, model } = require('mongoose');

const imagenSchema = Schema({
	nombre: {
		type: String,
		unique: true,
		required: [true, 'El nombre es obligatorio.'],
	},
	tipo: {
		type: String,
		required: true,

		enum: [
			"HOME_TOP",
			"HOME_TRL_CARD",
			"HOME_MOD_CARD",
			'MODULO_16',
			'MODULO_37',
			'MODULO_43',
		],
	},
	url: {
		type: String,
		default: '',
	},
	url2: {
		type: String,
		default: '',
	},
	descripcion: {
		type: String,
	},
});


imagenSchema.methods.toJSON = function () {
	const { __v, estado, ...data } = this.toObject();
	return data;
};

module.exports = model('Imagen', imagenSchema);
