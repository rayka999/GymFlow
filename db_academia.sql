-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 10/12/2025 às 18:46
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `db_academia`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `aluno`
--

CREATE TABLE `aluno` (
  `id_aluno` int(11) NOT NULL,
  `peso_atual` decimal(5,2) DEFAULT NULL,
  `altura` decimal(5,2) DEFAULT NULL,
  `objetivo` text DEFAULT NULL,
  `restricoes` text DEFAULT NULL,
  `id_instrutor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `categoria_exercicio`
--

CREATE TABLE `categoria_exercicio` (
  `id_categoria` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `coluna_regiao` enum('superior','inferior','core','fullbody') NOT NULL DEFAULT 'superior'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `categoria_exercicio`
--

INSERT INTO `categoria_exercicio` (`id_categoria`, `nome`, `coluna_regiao`) VALUES
(1, 'Peito', 'superior'),
(2, 'Costas', 'superior'),
(3, 'Ombro', 'superior'),
(4, 'Braço', 'superior'),
(5, 'Abdômen', 'core'),
(6, 'Glúteos', 'inferior'),
(7, 'Pernas', 'inferior'),
(8, 'Panturrilha', 'inferior'),
(9, 'Trapézio', 'superior'),
(10, 'Cardio', 'fullbody');

-- --------------------------------------------------------

--
-- Estrutura para tabela `conta_login`
--

CREATE TABLE `conta_login` (
  `id_login` int(11) NOT NULL,
  `id_pessoa` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `tipo` tinyint(4) NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `exercicio`
--

CREATE TABLE `exercicio` (
  `id_exercicio` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `descricao` text DEFAULT NULL,
  `id_musculo` int(11) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `tipo_midia` tinyint(4) DEFAULT NULL,
  `serie_padrao` int(11) DEFAULT NULL,
  `repeticoes_padrao` int(11) DEFAULT NULL,
  `descanso_padrao` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `instrutor`
--

CREATE TABLE `instrutor` (
  `id_instrutor` int(11) NOT NULL,
  `especialidade` varchar(150) DEFAULT NULL,
  `experiencia_anos` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `meta_aluno`
--

CREATE TABLE `meta_aluno` (
  `id_meta` int(11) NOT NULL,
  `id_aluno` int(11) NOT NULL,
  `id_exercicio` int(11) NOT NULL,
  `tipo_meta` tinyint(4) NOT NULL,
  `valor_alvo` decimal(10,2) DEFAULT NULL,
  `data_limite` date DEFAULT NULL,
  `descricao` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `musculo`
--

CREATE TABLE `musculo` (
  `id_musculo` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `musculo`
--

INSERT INTO `musculo` (`id_musculo`, `nome`, `id_categoria`) VALUES
(1, 'Peitoral Medial', 1),
(2, 'Peitoral Superior', 1),
(3, 'Peitoral Inferior', 1),
(4, 'Dorsal', 2),
(5, 'Lombar', 2),
(6, 'Redondo Maior', 2),
(7, 'Deltoide Anterior', 3),
(8, 'Deltoide Lateral', 3),
(9, 'Deltoide Posterior', 3),
(10, 'Bíceps', 4),
(11, 'Tríceps', 4),
(12, 'Antebraço', 4),
(13, 'Reto abdominal', 5),
(14, 'Oblíquos', 5),
(15, 'Glúteo Máximo', 6),
(16, 'Glúteo Médio', 6),
(17, 'Quadríceps', 7),
(18, 'Posterior de Coxa', 7),
(19, 'Gastrocnêmio', 8),
(20, 'Sóleo', 8),
(21, 'Trapézio Superior', 9),
(22, 'Trapézio Inferior', 9),
(23, 'Corpo inteiro', 10);

-- --------------------------------------------------------

--
-- Estrutura para tabela `personal_record`
--

CREATE TABLE `personal_record` (
  `id_pr` int(11) NOT NULL,
  `id_aluno` int(11) NOT NULL,
  `id_exercicio` int(11) NOT NULL,
  `maior_peso` decimal(6,2) DEFAULT NULL,
  `maior_repeticao` int(11) DEFAULT NULL,
  `data_registro` date DEFAULT NULL,
  `descricao` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `pessoa`
--

CREATE TABLE `pessoa` (
  `id_pessoa` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `data_nascimento` date DEFAULT NULL,
  `sexo` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `serie_realizada`
--

CREATE TABLE `serie_realizada` (
  `id_serie_realizada` int(11) NOT NULL,
  `id_treino_realizado` int(11) NOT NULL,
  `id_exercicio` int(11) NOT NULL,
  `serie_num` int(11) NOT NULL,
  `repeticoes_feitas` int(11) DEFAULT NULL,
  `peso_usado` decimal(6,2) DEFAULT NULL,
  `observacoes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `treino`
--

CREATE TABLE `treino` (
  `id_treino` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `descricao` text DEFAULT NULL,
  `criador_tipo` tinyint(4) NOT NULL,
  `id_criador` int(11) NOT NULL,
  `publico` tinyint(1) DEFAULT 0,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `treino_exercicio`
--

CREATE TABLE `treino_exercicio` (
  `id_treino_exercicio` int(11) NOT NULL,
  `id_treino` int(11) NOT NULL,
  `id_exercicio` int(11) NOT NULL,
  `ordem` int(11) NOT NULL,
  `serie_sugerida` int(11) DEFAULT NULL,
  `repeticoes_sugerida` int(11) DEFAULT NULL,
  `descanso_sugerido` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `treino_exercicio_personalizado`
--

CREATE TABLE `treino_exercicio_personalizado` (
  `id_personalizado` int(11) NOT NULL,
  `id_treino_exercicio` int(11) NOT NULL,
  `id_aluno` int(11) NOT NULL,
  `dia_semana` tinyint(4) NOT NULL,
  `serie` int(11) DEFAULT NULL,
  `repeticoes` int(11) DEFAULT NULL,
  `peso` decimal(6,2) DEFAULT NULL,
  `descanso` int(11) DEFAULT NULL,
  `observacoes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `treino_realizado`
--

CREATE TABLE `treino_realizado` (
  `id_treino_realizado` int(11) NOT NULL,
  `id_aluno` int(11) NOT NULL,
  `id_treino` int(11) NOT NULL,
  `data_treino` date NOT NULL,
  `duracao` int(11) DEFAULT NULL,
  `inicio` time DEFAULT NULL,
  `fim` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `aluno`
--
ALTER TABLE `aluno`
  ADD PRIMARY KEY (`id_aluno`),
  ADD KEY `id_instrutor` (`id_instrutor`);

--
-- Índices de tabela `categoria_exercicio`
--
ALTER TABLE `categoria_exercicio`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Índices de tabela `conta_login`
--
ALTER TABLE `conta_login`
  ADD PRIMARY KEY (`id_login`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_pessoa` (`id_pessoa`);

--
-- Índices de tabela `exercicio`
--
ALTER TABLE `exercicio`
  ADD PRIMARY KEY (`id_exercicio`),
  ADD KEY `id_musculo` (`id_musculo`);

--
-- Índices de tabela `instrutor`
--
ALTER TABLE `instrutor`
  ADD PRIMARY KEY (`id_instrutor`);

--
-- Índices de tabela `meta_aluno`
--
ALTER TABLE `meta_aluno`
  ADD PRIMARY KEY (`id_meta`),
  ADD KEY `id_aluno` (`id_aluno`),
  ADD KEY `id_exercicio` (`id_exercicio`);

--
-- Índices de tabela `musculo`
--
ALTER TABLE `musculo`
  ADD PRIMARY KEY (`id_musculo`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Índices de tabela `personal_record`
--
ALTER TABLE `personal_record`
  ADD PRIMARY KEY (`id_pr`),
  ADD KEY `id_aluno` (`id_aluno`),
  ADD KEY `id_exercicio` (`id_exercicio`);

--
-- Índices de tabela `pessoa`
--
ALTER TABLE `pessoa`
  ADD PRIMARY KEY (`id_pessoa`);

--
-- Índices de tabela `serie_realizada`
--
ALTER TABLE `serie_realizada`
  ADD PRIMARY KEY (`id_serie_realizada`),
  ADD KEY `id_treino_realizado` (`id_treino_realizado`),
  ADD KEY `id_exercicio` (`id_exercicio`);

--
-- Índices de tabela `treino`
--
ALTER TABLE `treino`
  ADD PRIMARY KEY (`id_treino`),
  ADD KEY `id_criador` (`id_criador`);

--
-- Índices de tabela `treino_exercicio`
--
ALTER TABLE `treino_exercicio`
  ADD PRIMARY KEY (`id_treino_exercicio`),
  ADD KEY `id_treino` (`id_treino`),
  ADD KEY `id_exercicio` (`id_exercicio`);

--
-- Índices de tabela `treino_exercicio_personalizado`
--
ALTER TABLE `treino_exercicio_personalizado`
  ADD PRIMARY KEY (`id_personalizado`),
  ADD KEY `id_treino_exercicio` (`id_treino_exercicio`),
  ADD KEY `id_aluno` (`id_aluno`);

--
-- Índices de tabela `treino_realizado`
--
ALTER TABLE `treino_realizado`
  ADD PRIMARY KEY (`id_treino_realizado`),
  ADD KEY `id_aluno` (`id_aluno`),
  ADD KEY `id_treino` (`id_treino`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categoria_exercicio`
--
ALTER TABLE `categoria_exercicio`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `conta_login`
--
ALTER TABLE `conta_login`
  MODIFY `id_login` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `exercicio`
--
ALTER TABLE `exercicio`
  MODIFY `id_exercicio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `meta_aluno`
--
ALTER TABLE `meta_aluno`
  MODIFY `id_meta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `musculo`
--
ALTER TABLE `musculo`
  MODIFY `id_musculo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de tabela `personal_record`
--
ALTER TABLE `personal_record`
  MODIFY `id_pr` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `pessoa`
--
ALTER TABLE `pessoa`
  MODIFY `id_pessoa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `serie_realizada`
--
ALTER TABLE `serie_realizada`
  MODIFY `id_serie_realizada` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `treino`
--
ALTER TABLE `treino`
  MODIFY `id_treino` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `treino_exercicio`
--
ALTER TABLE `treino_exercicio`
  MODIFY `id_treino_exercicio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `treino_exercicio_personalizado`
--
ALTER TABLE `treino_exercicio_personalizado`
  MODIFY `id_personalizado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `treino_realizado`
--
ALTER TABLE `treino_realizado`
  MODIFY `id_treino_realizado` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `aluno`
--
ALTER TABLE `aluno`
  ADD CONSTRAINT `aluno_ibfk_1` FOREIGN KEY (`id_aluno`) REFERENCES `conta_login` (`id_login`),
  ADD CONSTRAINT `aluno_ibfk_2` FOREIGN KEY (`id_instrutor`) REFERENCES `instrutor` (`id_instrutor`);

--
-- Restrições para tabelas `conta_login`
--
ALTER TABLE `conta_login`
  ADD CONSTRAINT `conta_login_ibfk_1` FOREIGN KEY (`id_pessoa`) REFERENCES `pessoa` (`id_pessoa`);

--
-- Restrições para tabelas `exercicio`
--
ALTER TABLE `exercicio`
  ADD CONSTRAINT `exercicio_ibfk_1` FOREIGN KEY (`id_musculo`) REFERENCES `musculo` (`id_musculo`);

--
-- Restrições para tabelas `instrutor`
--
ALTER TABLE `instrutor`
  ADD CONSTRAINT `instrutor_ibfk_1` FOREIGN KEY (`id_instrutor`) REFERENCES `conta_login` (`id_login`);

--
-- Restrições para tabelas `meta_aluno`
--
ALTER TABLE `meta_aluno`
  ADD CONSTRAINT `meta_aluno_ibfk_1` FOREIGN KEY (`id_aluno`) REFERENCES `aluno` (`id_aluno`),
  ADD CONSTRAINT `meta_aluno_ibfk_2` FOREIGN KEY (`id_exercicio`) REFERENCES `exercicio` (`id_exercicio`);

--
-- Restrições para tabelas `musculo`
--
ALTER TABLE `musculo`
  ADD CONSTRAINT `musculo_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria_exercicio` (`id_categoria`);

--
-- Restrições para tabelas `personal_record`
--
ALTER TABLE `personal_record`
  ADD CONSTRAINT `personal_record_ibfk_1` FOREIGN KEY (`id_aluno`) REFERENCES `aluno` (`id_aluno`),
  ADD CONSTRAINT `personal_record_ibfk_2` FOREIGN KEY (`id_exercicio`) REFERENCES `exercicio` (`id_exercicio`);

--
-- Restrições para tabelas `serie_realizada`
--
ALTER TABLE `serie_realizada`
  ADD CONSTRAINT `serie_realizada_ibfk_1` FOREIGN KEY (`id_treino_realizado`) REFERENCES `treino_realizado` (`id_treino_realizado`),
  ADD CONSTRAINT `serie_realizada_ibfk_2` FOREIGN KEY (`id_exercicio`) REFERENCES `exercicio` (`id_exercicio`);

--
-- Restrições para tabelas `treino`
--
ALTER TABLE `treino`
  ADD CONSTRAINT `treino_ibfk_1` FOREIGN KEY (`id_criador`) REFERENCES `conta_login` (`id_login`);

--
-- Restrições para tabelas `treino_exercicio`
--
ALTER TABLE `treino_exercicio`
  ADD CONSTRAINT `treino_exercicio_ibfk_1` FOREIGN KEY (`id_treino`) REFERENCES `treino` (`id_treino`),
  ADD CONSTRAINT `treino_exercicio_ibfk_2` FOREIGN KEY (`id_exercicio`) REFERENCES `exercicio` (`id_exercicio`);

--
-- Restrições para tabelas `treino_exercicio_personalizado`
--
ALTER TABLE `treino_exercicio_personalizado`
  ADD CONSTRAINT `treino_exercicio_personalizado_ibfk_1` FOREIGN KEY (`id_treino_exercicio`) REFERENCES `treino_exercicio` (`id_treino_exercicio`),
  ADD CONSTRAINT `treino_exercicio_personalizado_ibfk_2` FOREIGN KEY (`id_aluno`) REFERENCES `aluno` (`id_aluno`);

--
-- Restrições para tabelas `treino_realizado`
--
ALTER TABLE `treino_realizado`
  ADD CONSTRAINT `treino_realizado_ibfk_1` FOREIGN KEY (`id_aluno`) REFERENCES `aluno` (`id_aluno`),
  ADD CONSTRAINT `treino_realizado_ibfk_2` FOREIGN KEY (`id_treino`) REFERENCES `treino` (`id_treino`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
