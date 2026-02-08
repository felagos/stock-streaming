import React from 'react';
import { StockPrice } from '../types';

interface StockCardProps {
  stock: StockPrice;
  isSelected: boolean;
  onSelect: (stock: StockPrice) => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, isSelected, onSelect }) => {
  return (
    <div
      className={`stock-card ${isSelected ? 'active' : ''}`}
      onClick={() => onSelect(stock)}
    >
      <h3>{stock.symbol}</h3>
      <div className="price">${stock.price.toFixed(2)}</div>
      <div className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
        {stock.change >= 0 ? '↑' : '↓'} {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
      </div>
      <div className="timestamp">{new Date(stock.timestamp).toLocaleTimeString()}</div>
    </div>
  );
};

export default StockCard;
