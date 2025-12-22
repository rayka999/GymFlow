const express = require('express');
var router = express.Router();
const instrutorAuth = require('../middlewares/instrutor_auth');

router.get('/inicio', instrutorAuth, (req, res) => {
    res.render('instrutor-home', {
        usuario: req.session.usuario
    });
});

module.exports = router;