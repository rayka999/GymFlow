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

    const sqlConta = `
        SELECT c.*, p.nome
        FROM conta_login c
        INNER JOIN pessoa p ON p.id_pessoa = c.id_pessoa
        WHERE c.id_login = ?;
    `;

    const sqlInstrutores = `
        SELECT i.id_instrutor, p.nome
        FROM instrutor i
        INNER JOIN pessoa p ON p.id_pessoa = i.id_instrutor
    `;

    db.query(sqlConta, [id_login], (erroConta, resultadoConta) => {
        if (erroConta || resultadoConta.length === 0) {
            return res.render('aluno-account', {
                usuario: null,
                instrutores: [],
                erro: 'Erro ao carregar dados da conta.'
            });
        }

        db.query(sqlInstrutores, (erroInstrutores, instrutores) => {
            if (erroInstrutores) {
                return res.render('aluno-account', {
                    usuario: resultadoConta[0],
                    instrutores: [],
                    erro: 'Erro ao carregar instrutores.'
                });
            }

            res.render('aluno-account', {
                usuario: resultadoConta[0],
                instrutores: instrutores,
                erro: null
            });
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

router.get('/opcoes/treino/publico',alunoAuth, function (req,res){
    res.render('treino-publico', {
        usuario: req.session.usuario
    });
});

router.post('/opcoes/treino/publico', alunoAuth, function (req, res) {

    const id_criador = req.session.usuario.id;
    const { nome, descricao } = req.body;

    const sql_treino = `
        INSERT INTO treino 
        (id_criador, criador_tipo, criado_em, descricao, nome, publico)
        VALUES (?, 1, CURRENT_TIMESTAMP, ?, ?, 1)
    `;

    db.query(sql_treino, [id_criador, descricao, nome], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao criar treino');
        }

        res.redirect('/usuario/meus-treinos');
    });
});

router.get('/opcoes/treino/personalizado',alunoAuth, function (req,res){
    res.render('treino-personalizado', {
        usuario: req.session.usuario
    });
});

router.post('/opcoes/treino/personalizado', alunoAuth, function (req, res) {

    const id_criador = req.session.usuario.id;

    const {
        nome,
        descricao,
        dia_semana
    } = req.body;

    const sql_treino = `
        INSERT INTO treino 
        (id_criador, criador_tipo, criado_em, descricao, nome, publico)
        VALUES (?, 1, CURRENT_TIMESTAMP, ?, ?, 0)
    `;

    db.query(sql_treino, [id_criador, descricao, nome], function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao criar treino');
        }

        const id_treino = result.insertId;

        const sql_personalizado = `
            INSERT INTO treino_personalizado
            ( id_treino, id_aluno, dia_semana,observacoes)
            VALUES (?, ?, ?, NULL )
        `;

        db.query(
            sql_personalizado,
            [ id_treino, id_criador, dia_semana],
            function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao vincular treino');
                }

                res.redirect('/usuario/meus-treinos');
            }
        );
    });
});

router.get('/meus-treinos', alunoAuth, (req, res) => {

    const idAluno = req.session.usuario.id;

    const sqlPublicos = `
        SELECT * FROM treino
        WHERE id_criador = ?
          AND criador_tipo = 1
          AND publico = 1
    `;

    const sqlPrivados = `
        SELECT 
            t.*,
            p.dia_semana
        FROM treino t
        INNER JOIN treino_personalizado p
            ON p.id_treino = t.id_treino
        WHERE t.id_criador = ?
          AND t.criador_tipo = 1
          AND t.publico = 0
          AND p.id_aluno = ?
    `;

    db.query(sqlPublicos, [idAluno], (err, treinosPublicos) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao buscar treinos públicos');
        }

        db.query(sqlPrivados, [idAluno, idAluno], (err, treinosPrivados) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao buscar treinos personalizados');
            }

            res.render('aluno-treinos', {
                treinosPublicos,
                treinosPrivados
            });
        });
    });
});

router.get('/treino/:id/exercicios', alunoAuth, function (req, res) {

    const idTreino = req.params.id;

    const sqlTreino = 'SELECT * FROM treino WHERE id_treino = ?';
    const sqlExerciciosTreino = `
        SELECT te.id_treino_exercicio, e.nome,
               te.ordem, te.repeticoes_sugerida,
               te.serie_sugerida, te.descanso_sugerido
        FROM treino_exercicio te
        JOIN exercicio e ON e.id_exercicio = te.id_exercicio
        WHERE te.id_treino = ?
        ORDER BY te.ordem
    `;
    const sqlExercicios = 'SELECT * FROM exercicio';

    db.query(sqlTreino, [idTreino], function (err, treinoResult) {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao buscar treino');
        }

        db.query(sqlExerciciosTreino, [idTreino], function (err, exerciciosTreino) {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao buscar exercícios do treino');
            }

            db.query(sqlExercicios, function (err, exercicios) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao buscar exercícios');
                }

                res.render('treino-exercicios', {
                    treino: treinoResult[0],
                    exerciciosTreino,
                    exercicios
                });
            });
        });
    });
});

router.post('/treino/exercicio/add', alunoAuth, function (req, res) {

    const { id_treino, id_exercicio } = req.body;

    const sqlMaxOrdem = `
        SELECT MAX(ordem) AS maxOrdem
        FROM treino_exercicio
        WHERE id_treino = ?
    `;

    db.query(sqlMaxOrdem, [id_treino], function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao calcular ordem');
        }

        const novaOrdem = (result[0].maxOrdem || 0) + 1;

        const sqlInsert = `
            INSERT INTO treino_exercicio
            (id_treino, id_exercicio, ordem,
             repeticoes_sugerida, serie_sugerida, descanso_sugerido)
            VALUES (
                ?, ?, ?,
                (SELECT repeticoes_padrao FROM exercicio WHERE id_exercicio = ?),
                (SELECT serie_padrao FROM exercicio WHERE id_exercicio = ?),
                (SELECT descanso_padrao FROM exercicio WHERE id_exercicio = ?)
            )
        `;

        db.query(
            sqlInsert,
            [
                id_treino,
                id_exercicio,
                novaOrdem,
                id_exercicio,
                id_exercicio,
                id_exercicio
            ],
            function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao adicionar exercício');
                }

                res.redirect('/usuario/treino/' + id_treino + '/exercicios');
            }
        );
    });
});

router.post('/treino/exercicio/:id/delete', alunoAuth, function (req, res) {

    const idTreinoExercicio = req.params.id;

    const sqlBuscar = `
        SELECT id_treino, ordem
        FROM treino_exercicio
        WHERE id_treino_exercicio = ?
    `;

    db.query(sqlBuscar, [idTreinoExercicio], function (err, result) {
        if (err || result.length === 0) {
            console.error(err);
            return res.status(500).send('Exercício não encontrado');
        }

        const idTreino = result[0].id_treino;
        const ordemRemovida = result[0].ordem;

        db.query(
            'DELETE FROM treino_exercicio WHERE id_treino_exercicio = ?',
            [idTreinoExercicio],
            function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao remover exercício');
                }
                db.query(`
                    UPDATE treino_exercicio
                    SET ordem = ordem - 1
                    WHERE id_treino = ?
                      AND ordem > ?
                `, [idTreino, ordemRemovida], function (err) {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Erro ao reajustar ordem');
                    }

                    res.redirect('/usuario/treino/' + idTreino + '/exercicios');
                });
            }
        );
    });
});

router.get('/treino/exercicio/:id/up', alunoAuth, function (req, res) {

    const idTreinoExercicio = req.params.id;

    const sqlAtual = `
        SELECT id_treino, ordem
        FROM treino_exercicio
        WHERE id_treino_exercicio = ?
    `;

    db.query(sqlAtual, [idTreinoExercicio], function (err, atual) {
        if (err || atual.length === 0) {
            console.error(err);
            return res.status(500).send('Exercício não encontrado');
        }

        const idTreino = atual[0].id_treino;
        const ordemAtual = atual[0].ordem;

        if (ordemAtual === 1) {
            return res.redirect('/usuario/treino/' + idTreino + '/exercicios');
        }

        const sqlTrocar = `
            UPDATE treino_exercicio
            SET ordem = CASE
                WHEN ordem = ? THEN ?
                WHEN ordem = ? THEN ?
            END
            WHERE id_treino = ?
              AND ordem IN (?, ?)
        `;

        db.query(
            sqlTrocar,
            [ordemAtual, ordemAtual - 1,
             ordemAtual - 1, ordemAtual,
             idTreino,
             ordemAtual, ordemAtual - 1],
            function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao mover exercício');
                }

                res.redirect('/usuario/treino/' + idTreino + '/exercicios');
            }
        );
    });
});

router.get('/treino/exercicio/:id/down', alunoAuth, function (req, res) {

    const idTreinoExercicio = req.params.id;

    const sqlAtual = `
        SELECT id_treino, ordem
        FROM treino_exercicio
        WHERE id_treino_exercicio = ?
    `;

    db.query(sqlAtual, [idTreinoExercicio], function (err, atual) {
        if (err || atual.length === 0) {
            console.error(err);
            return res.status(500).send('Exercício não encontrado');
        }

        const idTreino = atual[0].id_treino;
        const ordemAtual = atual[0].ordem;

        db.query(`
            SELECT MAX(ordem) AS maxOrdem
            FROM treino_exercicio
            WHERE id_treino = ?
        `, [idTreino], function (err, max) {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao buscar ordem máxima');
            }

            if (ordemAtual === max[0].maxOrdem) {
                return res.redirect('/usuario/treino/' + idTreino + '/exercicios');
            }

            const sqlTrocar = `
                UPDATE treino_exercicio
                SET ordem = CASE
                    WHEN ordem = ? THEN ?
                    WHEN ordem = ? THEN ?
                END
                WHERE id_treino = ?
                  AND ordem IN (?, ?)
            `;

            db.query(
                sqlTrocar,
                [ordemAtual, ordemAtual + 1,
                 ordemAtual + 1, ordemAtual,
                 idTreino,
                 ordemAtual, ordemAtual + 1],
                function (err) {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Erro ao mover exercício');
                    }

                    res.redirect('/usuario/treino/' + idTreino + '/exercicios');
                }
            );
        });
    });
});

router.post('/treino/:id_treino/excluir', alunoAuth, function (req, res) {
    const id_treino = req.params.id_treino;
    const id_aluno=req.session.usuario.id;

    const sqlPersonalizado = `
        DELETE FROM treino_personalizado
        WHERE id_treino = ? AND id_aluno = ?;
    `;

    const sqlExercicios = `
        DELETE FROM treino_exercicio
        WHERE id_treino = ?;
    `;

    const sqlTreino = `
        DELETE FROM treino
        WHERE id_treino = ?;
    `;

    db.query(sqlPersonalizado, [id_treino, id_aluno], (erro) => {
        if (erro) {
            console.error(erro);
            return res.status(500).send('Erro ao excluir treino personalizado');
        }

        db.query(sqlExercicios, [id_treino], (erro) => {
            if (erro) {
                console.error(erro);
                return res.status(500).send('Erro ao excluir exercícios do treino');
            }
            db.query(sqlTreino, [id_treino], (erro) => {
                if (erro) {
                    console.error(erro);
                    return res.status(500).send('Erro ao excluir treino');
                }

                res.redirect('/usuario/meus-treinos');
            });
        });
    });
});


router.put('/aluno/dados', alunoAuth, function (req, res) {

    const id_aluno = req.session.usuario.id;

    const {
        peso_atual,
        altura,
        objetivo,
        restricoes,
        id_instrutor
    } = req.body;

    const sqlUpdate = `
        UPDATE aluno
        SET
            peso_atual = ?,
            altura = ?,
            objetivo = ?,
            restricoes = ?,
            id_instrutor = ?
        WHERE id_aluno = ?
    `;

    db.query(
        sqlUpdate,
        [
            peso_atual,
            altura,
            objetivo,
            restricoes,
            id_instrutor || null,
            id_aluno
        ],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao atualizar dados do aluno');
            }

            res.redirect('/usuario/conta');
        }
    );
});


module.exports = router;