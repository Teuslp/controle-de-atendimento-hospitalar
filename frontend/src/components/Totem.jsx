import React, { useState } from 'react';
import axios from 'axios';
import { FaTicketAlt, FaPrint } from 'react-icons/fa';

const Totem = () => {
  const [tipo, setTipo] = useState('SG');
  const [mensagem, setMensagem] = useState('');

  const emitirSenha = async () => {
    try {
      const response = await axios.post('http://localhost:3001/senhas', { tipo });
      setMensagem(`Senha ${response.data.codigo} emitida com sucesso!`);
    } catch (error) {
      setMensagem('Erro ao emitir senha. Tente novamente.');
      console.error('Erro:', error.response?.data || error.message);
    }
  };

  return (
    <div className="totem">
      <h2>
        <FaTicketAlt className="icon" /> Selecione o tipo de atendimento:
      </h2>
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="select-tipo"
      >
        <option value="SG">Geral</option>
        <option value="SP">Prioritário</option>
        <option value="SE">Exames</option>
      </select>
      <button onClick={emitirSenha} className="btn-emitir">
        <FaPrint className="icon" /> Emitir Senha
      </button>
      {mensagem && <div className="mensagem">{mensagem}</div>}
    </div>
  );
};

export default Totem;