var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('pag-inicial');
});

router.get('/sobre', function(req,res){
  res.render('pag-sobre')
});

router.get('/contato', function (req,res) {
  res.render('pag-contato')
});

router.get('/login', function(req, res) {
    res.render('usuario-login');
});

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
};

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
                            res.redirect('/login');
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

router.post('/login', function(req, res) {

    const { email, senha, typeUser } = req.body;

    if (!email || !senha) {
        return res.render('usuario-login', {
            erro: 'Preencha todos os campos'
        });
    }

    const sql = `
        SELECT * FROM conta_login
        WHERE email = ? OR user_name= ? AND tipo = ?;
    `;

    db.query(sql, [email,email, typeUser, senha], (erro, resultado) => {

        if (erro) {
            console.error(erro);
            return res.render('usuario-login', {
                erro: 'Erro no sistema'
            });
        }

        if (resultado.length === 0) {
            return res.render('usuario-login', {
                erro: 'E-mail, nome de usuário ou senha inválidos'
            });
        }

        const usuario = resultado[0];

        if (senha !== usuario.senha_hash) {
            return res.render('usuario-login', {
                erro: 'E-mail, nome de usuário ou senha inválidos'
            });
        }
        req.session.usuario = {
        id: usuario.id_login,
        email: usuario.email,
        user_name:usuario.user_name,
        tipo: usuario.tipo
        };

        if (usuario.tipo == 1) {
          res.redirect('/usuario/inicio');
        } else {
          res.redirect('/instrutor/inicio');
        }

    });

});

module.exports = router;
