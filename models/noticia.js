const { Schema, model } = require('mongoose');

const noticiaSchema = Schema({
	titulo: {
		type: String,
		required: [true, 'El titulo es obligatorio.'],
	},

	imageUrl: {
		type: String,
		default: '',
	},
	descripcion: {
		type: String,
	},
  estado: {
		type: Boolean,
		default: true,
	},
});

noticiaSchema.methods.toJSON = function () {
	const { __v, estado, ...data } = this.toObject();
	return data;
};

module.exports = model('Noticia', noticiaSchema);
