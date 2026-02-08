import { useQuery } from '@tanstack/react-query';
import { stockApi } from '../services/api';
import { StockPrice } from '../types';

export const stockKeys = {
  all: ['stocks'] as const,
  lists: () => [...stockKeys.all, 'list'] as const,
  list: (filters?: string) => [...stockKeys.lists(), { filters }] as const,
  details: () => [...stockKeys.all, 'detail'] as const,
  detail: (symbol: string) => [...stockKeys.details(), symbol] as const,
};

export function useStocks(interval: number = 5000) {
  return useQuery<StockPrice[], Error>({
    queryKey: stockKeys.lists(),
    queryFn: () => stockApi.getStocks(),
    refetchInterval: interval,
  });
}

export function useStock(symbol: string) {
  return useQuery<StockPrice, Error>({
    queryKey: stockKeys.detail(symbol),
    queryFn: () => stockApi.getStockBySymbol(symbol),
    enabled: !!symbol,
  });
}
