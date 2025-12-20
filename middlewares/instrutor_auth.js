function instrutorAuth(req, res, next) {
    if (!req.session.usuario || req.session.usuario.tipo !== 2) {
        return res.redirect('/login');
    }
    next();
}

module.exports = instrutorAuth;