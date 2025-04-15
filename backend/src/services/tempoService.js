module.exports = {
  calculatorTM: (tipo) => {
    // Valores base + variação aleatória
    const variacoes = {
      SP: { base: 15, variacao: 5 },  // 15 ± 5 minutos
      SE: { base: 1, variacao: 0.5 }, // 1 ± 0.5 minuto (95% 1min, 5% 5min)
      SG: { base: 5, variacao: 3 }    // 5 ± 3 minutos
    };

    const config = variacoes[tipo] || variacoes.SG;
    
    // Lógica especial para SE (5% de chance de ser 5 minutos)
    if (tipo === 'SE' && Math.random() < 0.05) {
      return 5;
    }
    
    return config.base + (Math.random() * config.variacao * 2 - config.variacao);
  }
};