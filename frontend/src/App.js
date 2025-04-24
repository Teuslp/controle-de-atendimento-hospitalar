import React from 'react';
import Totem from './components/Totem';
import Painel from './components/Painel';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Lab Médico - Controle de Atendimento</h1>
      </header>
      <main>
        <div className="container">
          <section className="totem-section">
            <h2>Totem de Autoatendimento</h2>
            <Totem />
          </section>
          <section className="painel-section">
            <h2>Painel de Chamadas</h2>
            <Painel />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;