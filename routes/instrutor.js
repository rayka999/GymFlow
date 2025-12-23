const express = require('express');
var router = express.Router();
const instrutorAuth = require('../middlewares/instrutor_auth');

router.get('/inicio', instrutorAuth, function (req, res) {
    const id_login = req.session.usuario.id;

    const sql = `
        SELECT c.*, p.nome
        FROM conta_login c
        INNER JOIN pessoa p ON p.id_pessoa = c.id_pessoa
        WHERE c.id_login = ?;
    `;

    db.query(sql, [id_login], (erro, resultado) => {
        if (erro) {
            return res.render('instrutor-home', {
                usuario: null,
                erro: 'Erro ao carregar dados da conta.'
            });
        }

        res.render('instrutor-home', {
            usuario: resultado[0],
            erro: null
        });
    });
});

router.get('/opcoes', instrutorAuth, (req, res) => {
    res.render('instrutor-opcoes', {
        usuario: req.session.usuario
    });
});

router.get('/alunos', instrutorAuth, (req, res) => {
    res.render('instrutor-alunos', {
        usuario: req.session.usuario
    });
});

router.get('/conta', instrutorAuth, function (req, res) {
    const id_login = req.session.usuario.id;

    const sql = `
        SELECT c.*, p.nome
        FROM conta_login c
        INNER JOIN pessoa p ON p.id_pessoa = c.id_pessoa
        WHERE c.id_login = ?;
    `;

    db.query(sql, [id_login], (erro, resultado) => {
        if (erro) {
            return res.render('instrutor-account', {
                usuario: null,
                erro: 'Erro ao carregar dados da conta.'
            });
        }

        res.render('instrutor-account', {
            usuario: resultado[0],
            erro: null
        });
    });
});

router.get('/logout',instrutorAuth, (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;