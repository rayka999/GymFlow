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

router.get('/opcoes/exercicio', instrutorAuth, function(req, res) {

    let idCategoria = parseInt(req.query.categoria) || 0;
    let idMusculo = parseInt(req.query.musculo) || 0;

    let sqlCategorias = `
        SELECT id_categoria, nome 
        FROM categoria_exercicio
    `;

    let sqlMusculos = `
        SELECT id_musculo, nome 
        FROM musculo
        WHERE id_categoria = ?
    `;

    let sqlExercicios = `
        SELECT 
            e.id_exercicio,
            e.nome,
            c.nome AS categoria,
            m.nome AS musculo
        FROM exercicio e
        INNER JOIN musculo m ON e.id_musculo = m.id_musculo
        INNER JOIN categoria_exercicio c ON m.id_categoria = c.id_categoria
        WHERE 1=1
    `;

    let params = [];

    if (idCategoria !== 0) {
        sqlExercicios += " AND c.id_categoria = ? ";
        params.push(idCategoria);
    }

    if (idMusculo !== 0) {
        sqlExercicios += " AND m.id_musculo = ? ";
        params.push(idMusculo);
    }

    db.query(sqlCategorias, function(err, categorias) {
        if (err) return res.send(err);

        if (idCategoria === 0) {

            db.query(sqlExercicios, params, function(err, exercicios) {
                if (err) return res.send(err);

                return res.render('i-exercicio-filtro', {
                    categorias,
                    musculos: [],
                    exercicios,
                    idCategoria,
                    idMusculo
                });
            });

        } else {

            db.query(sqlMusculos, [idCategoria], function(err, musculos) {
                if (err) return res.send(err);

                db.query(sqlExercicios, params, function(err, exercicios) {
                    if (err) return res.send(err);

                    res.render('i-exercicio-filtro', {
                        categorias,
                        musculos,
                        exercicios,
                        idCategoria,
                        idMusculo
                    });
                });
            });
        }
    });
});

router.get('/opcoes/exercicio/add', instrutorAuth, function(req, res) {
    let categoriaSelecionada = req.query.categoria || null;

    let sqlCategorias = "SELECT id_categoria, nome FROM categoria_exercicio";

    db.query(sqlCategorias, function(err, categorias) {
        if (err) return res.send(err);

        if (!categoriaSelecionada) {
            return res.render('i-exercicio-add', {
                categorias,
                musculos: [],
                categoriaSelecionada: null
            });
        }

        let sqlMusculos = "SELECT id_musculo, nome FROM musculo WHERE id_categoria = ?";

        db.query(sqlMusculos, [categoriaSelecionada], function(err, musculos) {
            if (err) return res.send(err);

            res.render('i-exercicio-add', {
                categorias,
                musculos,
                categoriaSelecionada
            });
        });
    });
});

router.post('/opcoes/exercicio/add',instrutorAuth , function(req, res) {

    let { nome, descricao, id_musculo, url, tipo_midia,
          serie_padrao, repeticoes_padrao, descanso_padrao } = req.body;

    let sql = `
        INSERT INTO exercicio 
        (nome, descricao, id_musculo, url, tipo_midia, 
         serie_padrao, repeticoes_padrao, descanso_padrao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        nome, descricao, id_musculo, url, tipo_midia,
        serie_padrao, repeticoes_padrao, descanso_padrao
    ], function(err) {
        if (err) return res.send(err);
        res.redirect('/instrutor/opcoes/exercicio');
    });
});

router.get('/opcoes/exercicio/:id_exercicio', instrutorAuth, function(req, res) {
    let id = req.params.id_exercicio;

    let sql = `
        SELECT 
            id_exercicio,
            nome,
            descricao,
            url,
            tipo_midia,
            serie_padrao,
            repeticoes_padrao,
            descanso_padrao
        FROM exercicio
        WHERE id_exercicio = ?;
    `;

    db.query(sql, [id], function(erro, rows) {
        if (erro) return res.send(erro);

        if (rows.length === 0)
            return res.send("Exercício não encontrado.");

        res.render('i-exercicio-uni', { exercicio: rows[0] });
    });
});

module.exports = router;