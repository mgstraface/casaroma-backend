const { Schema, model } = require('mongoose');

const productoSchema = Schema({
	nombre: {
		type: String,

		required: [true, 'El nombre es obligatorio.'],
	},

	estado: {
		type: Boolean,
		default: true,
	},
	categoria: {
		type: String,
		required: true,

		enum: [
			"AMBO",
			"MODULO",
		],
	},

	fechaCreacion: {
		type: Date,
		default: Date.now,
	},
	descripcion: {
		type: String,
	},
	description: {
		type: String,
	},

	precio: {
		type: Number,
	},

	precioPromo: {
		type: Number,
	},
	// Nuevos campos añadidos
	talles: {
		type: [String],
	},

	colores: {
		type: [String],
	},
	imgCard: {
		type: String,
	},
	imgCarousel: {
		type: String,
	},

	linkTienda: {
		type: String,
	},
	marca: {
		type: String,
	},

	imagenes: [
		{
			url: String,
			texto: String,
		},
	],
});

productoSchema.methods.toJSON = function () {
	const { __v, ...data } = this.toObject();
	return data;
};

module.exports = model('Producto', productoSchema);
