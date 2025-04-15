-- Garante que as tabelas sejam recriadas corretamente
DROP TABLE IF EXISTS atendimentos;
DROP TABLE IF EXISTS senhas;
DROP TABLE IF EXISTS sequencias;

CREATE TABLE senhas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  tipo ENUM('SP', 'SG', 'SE') NOT NULL,
  data_emissao DATETIME DEFAULT CURRENT_TIMESTAMP,
  atendida BOOLEAN DEFAULT FALSE,
  INDEX idx_tipo_atendida (tipo, atendida)
);

CREATE TABLE atendimentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  senha_id INT NOT NULL,
  guiche INT NOT NULL,
  inicio_atendimento DATETIME DEFAULT CURRENT_TIMESTAMP,
  fim_atendimento DATETIME,
  FOREIGN KEY (senha_id) REFERENCES senhas(id) ON DELETE CASCADE,
  INDEX idx_inicio (inicio_atendimento)
);

CREATE TABLE sequencias (
  data DATE PRIMARY KEY,
  sp_seq INT DEFAULT 1,
  sg_seq INT DEFAULT 1,
  se_seq INT DEFAULT 1
);