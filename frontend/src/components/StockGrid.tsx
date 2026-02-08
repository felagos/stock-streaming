import React from 'react';
import { StockPrice } from '../types';
import StockCard from './StockCard';
import './StockGrid.css';

interface StockGridProps {
  stocks: StockPrice[];
  selectedStock: StockPrice | null;
  onSelectStock: (stock: StockPrice) => void;
}

const StockGrid: React.FC<StockGridProps> = ({ stocks, selectedStock, onSelectStock }) => {
  return (
    <div className="stock-grid">
      {stocks.map((stock) => (
        <StockCard
          key={stock.symbol}
          stock={stock}
          isSelected={selectedStock?.symbol === stock.symbol}
          onSelect={onSelectStock}
        />
      ))}
    </div>
  );
};

export default StockGrid;
