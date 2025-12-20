const express = require('express');
const router = express.Router();
const instrutorAuth = require('../middlewares/instrutorAuth');

router.get('/', instrutorAuth, (req, res) => {
    res.render('instrutor-home', {
        usuario: req.session.usuario
    });
});

module.exports = router;