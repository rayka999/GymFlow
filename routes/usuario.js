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

function renderCadastro(res, erro = null) {
    const sql = `
        SELECT i.id_instrutor, p.nome
        FROM instrutor i
        INNER JOIN pessoa p ON p.id_pessoa = i.id_instrutor
    `;

    db.query(sql, (err, instrutores) => {
        res.render('usuario-add', {
            instrutores: instrutores || [],
            erro
        });
    });
}

router.post('/cadastro', (req, res) => {

    const {
        nome,
        data_nascimento,
        sexo,
        email,
        user_name,
        senha,
        tipo
    } = req.body;

    const sqlVerifica = `
        SELECT id_login
        FROM conta_login
        WHERE email = ? OR user_name = ?
    `;

    db.query(sqlVerifica, [email, user_name], (err, rows) => {
        if (err) return res.send(err);

        if (rows.length > 0) {
            return renderCadastro(
                res,
                'E-mail ou nome de usuário já cadastrados.'
            );
        }

        const sqlPessoa = `
            INSERT INTO pessoa (nome, data_nascimento, sexo)
            VALUES (?, ?, ?)
        `;

        db.query(sqlPessoa, [nome, data_nascimento, sexo], (err2, resultPessoa) => {
            if (err2) return res.send(err2);

            const idPessoa = resultPessoa.insertId;

            const sqlConta = `
                INSERT INTO conta_login (email, user_name, senha_hash, id_pessoa, tipo)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(sqlConta, [email, user_name, senha, idPessoa, tipo], (err3, resultConta) => {
                if (err3) return res.send(err3);

                const idConta = resultConta.insertId;

                if (tipo == 1) {

                    const {
                        peso_atual,
                        altura,
                        objetivo,
                        restricoes,
                        id_instrutor
                    } = req.body;

                    const sqlAluno = `
                        INSERT INTO aluno
                        (id_aluno, peso_atual, altura, objetivo, restricoes, id_instrutor)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `;

                    db.query(
                        sqlAluno,
                        [idConta, peso_atual, altura, objetivo, restricoes, id_instrutor || null],
                        (err4) => {
                            if (err4) return res.send(err4);
                            res.redirect('/');
                        }
                    );
                }

                else if (tipo == 2) {

                    const {
                        especialidade,
                        experiencia_anos
                    } = req.body;

                    const sqlInstrutor = `
                        INSERT INTO instrutor
                        (id_instrutor, especialidade, experiencia_anos)
                        VALUES (?, ?, ?)
                    `;

                    db.query(
                        sqlInstrutor,
                        [idConta, especialidade, experiencia_anos],
                        (err4) => {
                            if (err4) return res.send(err4);
                            res.redirect('/');
                        }
                    );
                }
            });
        });
    });
});

router.get('/login', function(req, res) {
  res.render('usuario-login');
});

router.get('/opcoes',function(req,res){
    res.render('aluno-options')
});

module.exports = router;