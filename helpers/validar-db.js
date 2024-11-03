const { Usuario, Producto, Noticia } = require('../models');

// const esRoleValido = async (role = '') => {
// 	const existeRole = await Role.findOne({ role });
// 	if (!existeRole) {
// 		throw new Error(`El role ${role} no está registrado en la base de datos`);
// 	}
// };

//validaciones usuario

const existeEmail = async (correo = '') => {
	const usuario = await Usuario.findOne({ correo });
	if (usuario) {
		throw new Error(`El correo ${correo} ya se encuentra registrado`);
	}
};

const existeId = async (id) => {
	const usuario = await Usuario.findById(id);
	if (!usuario) {
		throw new Error(`El usuario con id ${id} no existe en la base de datos`);
	}
};

//validaciones categoría.

// const existeCategoriaId = async (id) => {
// 	const categoria = await Categoria.findById(id);
// 	if (!categoria) {
// 		throw new Error(`La categoría id ${id} no existe en la base de datos`);
// 	}
// };

// //validaciones giftcards
// const existeGiftcardId = async (id) => {
// 	const giftcard = await Giftcard.findById(id);
// 	if (!giftcard) {
// 		throw new Error(`La giftcard id ${id} no existe en la base de datos`);
// 	}
// };

// const existeGiftcardCodigo = async (codigo) => {
// 	const giftcard = await Giftcard.findOne({ codigo });
// 	if (!giftcard) {
// 		throw new Error(`La giftcard con el cofigo ${codigo} no existe en la base de datos`);
// 	}
// };

// //validaciones producto

const existeProductoId = async (id) => {
	//verifica si existe el producto en la db
	const producto = await Producto.findById(id);
	if (!producto) {
		throw new Error(`El producto con el id ${id} no existe en la base de datos`);
	}
};

const existeNoticiaId = async (id) => {
	//verifica si existe el producto en la db
	const noticia = await Noticia.findById(id);
	if (!noticia) {
		throw new Error(`La noticia con el id ${id} no existe en la base de datos`);
	}
};

// const existeAlianzaId = async (id) => {
// 	//verifica si existe el producto en la db
// 	const alianza = await Alianza.findById(id);
// 	if (!alianza) {
// 		throw new Error(`La alianza con el id ${id} no existe en la base de datos`);
// 	}
// };

//validar colecciones permitidas

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
	const incluida = colecciones.includes(coleccion);

	if (!incluida) {
		throw new Error(
			`La colección ${coleccion} no existe en la base de datos. Las colecciones permitidas son: ${colecciones}`
		);
	}
	return true;
};

module.exports = {
	//esRoleValido,
	existeEmail,
	existeId,
	//existeCategoriaId,
	existeProductoId,
	existeNoticiaId,
	coleccionesPermitidas,
	//	existeGiftcardId,
	//	existeGiftcardCodigo,
	//existeAlianzaId,
};
