var express = require('express');
var router = express.Router();
var db = require('../utils/db');

router.get('/cadastro', (req, res) => {

    const sql = `
        SELECT i.id_instrutor, p.nome
        FROM instrutor i
        INNER JOIN pessoa p ON p.id_pessoa = i.id_instrutor
    `;

    db.query(sql, (erro, instrutores) => {
        if (erro) throw erro;

        res.render('usuario-add', {
            instrutores: instrutores
        });
    });

});

module.exports = router;
