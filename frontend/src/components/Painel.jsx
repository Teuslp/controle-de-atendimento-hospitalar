import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDesktop, FaClock, FaTicketAlt, FaBell } from 'react-icons/fa';

const Painel = () => {
  const [ultimasSenhas, setUltimasSenhas] = useState([]);
  const [senhaAtual, setSenhaAtual] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const chamarProxima = async () => {
    try {
      setMensagem('Chamando próxima senha...');
      const response = await axios.get('http://localhost:3001/chamadas/proxima');
      
      if (response.data.message) {
        setMensagem(response.data.message);
      } else {
        setSenhaAtual(response.data);
        setMensagem(`Senha ${response.data.senha} chamada com sucesso!`);
        carregarUltimasSenhas();
      }
    } catch (error) {
      const erroMsg = error.response?.data?.error || 
                     error.response?.data?.message || 
                     error.message;
      setMensagem(`Erro: ${erroMsg}`);
      console.error("Detalhes do erro:", error.response || error);
    }
  };

  const carregarUltimasSenhas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/chamadas/ultimas');
      setUltimasSenhas(response.data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  useEffect(() => {
    carregarUltimasSenhas();
    const interval = setInterval(carregarUltimasSenhas, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="painel-section">
      <h2>Painel de Chamadas</h2>
      
      {senhaAtual ? (
        <div className="senha-atual">
          <h1>
            <FaTicketAlt className="icon" /> {senhaAtual.senha}
          </h1>
          <div className="detalhes-senha">
            <p>
              <FaDesktop className="icon" /> <strong>Guichê:</strong> {senhaAtual.guiche}
            </p>
            <p>
              <FaClock className="icon" /> <strong>Tempo estimado:</strong> {Number(senhaAtual.tempoMedio).toFixed(1)} min
            </p>
            <p>
              <strong>Tipo:</strong> {{
                'SP': 'Prioritária',
                'SE': 'Exames',
                'SG': 'Geral'
              }[senhaAtual.tipo]}
            </p>
          </div>
        </div>
      ) : (
        <div className="nenhuma-senha">
          <p>Nenhuma senha sendo atendida</p>
        </div>
      )}

      <button onClick={chamarProxima} className="btn-chamar">
        <FaBell className="icon" /> Chamar Próxima Senha
      </button>

      {mensagem && <div className="mensagem">{mensagem}</div>}

      <div className="historico">
        <h3>
          <FaTicketAlt className="icon" /> Últimas senhas chamadas
        </h3>
        <ul>
          {ultimasSenhas.length > 0 ? (
            ultimasSenhas.map((senha, index) => (
              <li key={index}>
                <FaTicketAlt className="icon-small" />
                <span className="senha-codigo">{senha.codigo}</span>
                <span className="senha-detalhes">
                  <FaDesktop className="icon-small" /> {senha.guiche} • <FaClock className="icon-small" /> {senha.horario}
                </span>
              </li>
            ))
          ) : (
            <li>Nenhuma senha recente</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Painel;