var express = require('express');

function autenticado(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    next();
}

module.exports = autenticado;