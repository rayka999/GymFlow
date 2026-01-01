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

router.get('/estatisticas',alunoAuth,function (req,res){
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

router.get('/logout',alunoAuth, (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

router.get('/opcoes/exercicio',alunoAuth, (req,res) => {
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

                return res.render('a-exercicio-filtro', {
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

                    res.render('a-exercicio-filtro', {
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

router.get('/opcoes/exercicio/add',alunoAuth, (req,res) => {
    let categoriaSelecionada = req.query.categoria || null;

    let sqlCategorias = "SELECT id_categoria, nome FROM categoria_exercicio";

    db.query(sqlCategorias, function(err, categorias) {
        if (err) return res.send(err);

        if (!categoriaSelecionada) {
            return res.render('a-exercicio-add', {
                categorias,
                musculos: [],
                categoriaSelecionada: null
            });
        }

        let sqlMusculos = "SELECT id_musculo, nome FROM musculo WHERE id_categoria = ?";

        db.query(sqlMusculos, [categoriaSelecionada], function(err, musculos) {
            if (err) return res.send(err);

            res.render('a-exercicio-add', {
                categorias,
                musculos,
                categoriaSelecionada
            });
        });
    });
});

router.post('/opcoes/exercicio/add',alunoAuth, (req,res) => {
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
        res.redirect('/usuario/opcoes/exercicio');
    });
});

router.get('/opcoes/exercicio/:id_exercicio', alunoAuth, (req,res) =>{
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

        res.render('a-exercicio-uni', { exercicio: rows[0] });
    });
})

module.exports = router;