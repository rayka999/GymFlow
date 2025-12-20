var express = require('express');
var router = express.Router();
var db = require('../utils/db');
const alunoAuth = require('../middlewares/aluno_auth');

router.get('/inicio', alunoAuth, function (req, res) {
    const id_login=req.session.usuario.id;

    const sql = `
        SELECT c.*, p.nome
        FROM conta_login c
        INNER JOIN pessoa p ON p.id_pessoa = c.id_pessoa
        WHERE c.id_login = ?;
    `;

    db.query(sql, [id_login], (erro, resultado) => {
        if (erro) {
            return res.render('aluno-home', {
                usuario: null,
                erro: 'Erro ao carregar dados da conta.'
            });
        }
        res.render('aluno-home', {
            usuario: resultado[0],
            erro: null
        });
    });
});

router.get('/opcoes',alunoAuth, function (req,res){
    res.render('aluno-options', {
        usuario: req.session.usuario
    });
});

router.get('/estatisticas',function (req,res){
    res.render('aluno-est', {
        usuario: req.session.usuario
    });
});

router.get('/conta', alunoAuth, function(req, res) {

    const id_login = req.session.usuario.id;

    const sql = `
        SELECT c.*, p.nome
        FROM conta_login c
        INNER JOIN pessoa p ON p.id_pessoa = c.id_pessoa
        WHERE c.id_login = ?;
    `;

    db.query(sql, [id_login], (erro, resultado) => {
        if (erro) {
            return res.render('aluno-account', {
                usuario: null,
                erro: 'Erro ao carregar dados da conta.'
            });
        }

        res.render('aluno-account', {
            usuario: resultado[0],
            erro: null
        });
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});


module.exports = router;