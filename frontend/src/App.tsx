import React, { useEffect, useState } from 'react';
import './App.css';
import StockGrid from './components/StockGrid';
import { useSSEStream } from './hooks/useSSEStream';
import { StockPrice } from './types';

const App: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<StockPrice | null>(null);

  const { stocks, connected, error } = useSSEStream();

  useEffect(() => {
    if (stocks.length > 0 && !selectedStock) {
      setSelectedStock(stocks[0]);
    }
  }, [stocks, selectedStock]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>📈 Stock Prices - Real-time Streaming</h1>
        <p>Dashboard de precios de acciones en tiempo real</p>
        <div className="connection-status">
          {connected ? (
            <span className="status-connected">🟢 Conectado en tiempo real</span>
          ) : (
            <span className="status-disconnected">🔴 Conectando...</span>
          )}
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            Error en la conexión SSE: {error}. Verifica la conexión al servidor.
          </div>
        )}
        
        <div className="dashboard-container">
          <div className="left-panel">
            <h2>Precios de Acciones</h2>
            {stocks.length === 0 ? (
              <div className="loading">Cargando precios desde SSE...</div>
            ) : (
              <StockGrid 
                stocks={stocks} 
                selectedStock={selectedStock}
                onSelectStock={setSelectedStock}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
