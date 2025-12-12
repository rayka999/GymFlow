let express = require('express');
let db= require ('../utils/db')
let router = express.Router();

router.get('/', function(req, res) {
    db.query(`SELECT id_categoria, nome FROM categoria_exercicio;`, [], function(erro, listagem) {
        if (erro) {
            return res.send(erro);
        }
        res.render('categorias', { categorias: listagem });
    });
});

router.get('/:id_categoria', function(req, res) {
    let id = req.params.id_categoria;
    let sql = `
        SELECT 
            m.id_musculo,
            m.nome AS musculo_nome,
            e.id_exercicio,
            e.nome AS exercicio_nome
        FROM musculo m
        LEFT JOIN exercicio e ON e.id_musculo = m.id_musculo
        WHERE m.id_categoria = ?;
    `;
    db.query(sql, [id], function(erro, rows) {
        if (erro) return res.send(erro);
        let dados = {};
        rows.forEach(row => {
            if (!dados[row.id_musculo]) {
                dados[row.id_musculo] = {
                    nome: row.musculo_nome,
                    exercicios: []
                };
            }
            if (row.id_exercicio) {
                dados[row.id_musculo].exercicios.push({
                    id: row.id_exercicio,
                    nome: row.exercicio_nome
                });
            }
        });
        res.render('musculos', { dados });
    });
});

router.get('/exercicio/:id_exercicio', function(req, res) {
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

        res.render('exercicio', { exercicio: rows[0] });
    });
});

module.exports = router;
