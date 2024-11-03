const validarDb = require('./validar-db');
const generarJWT = require('./generar-jwt');
const verificarGoogle = require('./verificar-google');

module.exports = {
	...validarDb,
	...generarJWT,
	...verificarGoogle,
};
