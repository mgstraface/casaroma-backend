const { response } = require('express');

const esSuperAdminRole = (req, res = response, next) => {
	if (!req.usuario) {
		return res.status(500).json({
			msg: 'Se está intentando verificar el rol sin validar el token primero.',
		});
	}

	const { role, nombre } = req.usuario;

	if (role !== 'SUPERADMIN_ROLE') {
		return res.status(401).json({
			msg: `El usuario ${nombre}, no tiene los permisos necesarios para ejecutar esta acción.`,
		});
	}
	next();
};

const tieneRole = (...roles) => {
	return (req, res = response, next) => {
		if (!req.usuario) {
			return res.status(500).json({
				msg: 'Se está intentando verificar el rol sin validar el token primero.',
			});
		}

		if (!roles.includes(req.usuario.role)) {
			return res
				.status(401)
				.json({ msg: `Rol de usuario no autorizado. El rol debe ser uno de estos: ${roles}` });
		}

		next();
	};
};

module.exports = {
	esSuperAdminRole,
	tieneRole,
};
