import { useEffect, useRef, useState } from 'react';
import { StockPrice } from '../types';

const DEFAULT_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

export function useSSEStream(symbols: string[] = DEFAULT_SYMBOLS) {
  const [stocks, setStocks] = useState<Map<string, StockPrice>>(new Map());
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (eventSourceRef.current) return;

    const symbolsStr = symbols.join(',');
    const url = `/api/stream/sse?symbols=${symbolsStr}`;

    console.log('🔗 Connecting to SSE stream:', url);

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.addEventListener('stock-update', (event) => {
      try {
        const data = JSON.parse(event.data) as StockPrice;
        setStocks((prev) => new Map(prev).set(data.symbol, data));
        setConnected(true);
        setError(null);
      } catch (err) {
        console.error('Error parsing SSE data:', err);
      }
    });

    eventSource.addEventListener('done', () => {
      console.log('✓ SSE stream completed');
      setConnected(false);
    });

    eventSource.addEventListener('error', (event) => {
      console.error('❌ SSE error event:', event);
      setError('Connection error from SSE stream');
      setConnected(false);
    });

    eventSource.onerror = () => {
      console.error('❌ EventSource connection error');
      if (eventSource.readyState === EventSource.CLOSED) {
        setConnected(false);
        setError('SSE connection closed');
      }
    };

    return () => {
      console.log('Closing SSE connection');
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  return {
    stocks: Array.from(stocks.values()),
    connected,
    error,
    disconnect: () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    },
  };
}
