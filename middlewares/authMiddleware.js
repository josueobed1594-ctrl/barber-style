module.exports = function (req, res, next) {

    if (!req.session.usuario) {
        return res.redirect('/login');
    }

    const rol = String(req.session.usuario.rol || '').trim().toLowerCase();

    if (rol !== 'admin') {
        return res.send('No autorizado');
    }

    next();
};