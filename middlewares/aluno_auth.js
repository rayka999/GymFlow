function alunoAuth(req, res, next) {
    if (!req.session.usuario || req.session.usuario.tipo !== 1) {
        return res.redirect('/login');
    }
    next();
}

module.exports = alunoAuth;