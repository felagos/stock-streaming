import axios, { AxiosInstance } from 'axios';
import { StockPrice } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class StockApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        console.log(`📤 [${config.method?.toUpperCase()}] ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(`📥 Response from ${response.config.url}:`, response.status);
        return response;
      },
      (error) => {
        if (error.response) {
          console.error(`❌ Error ${error.response.status}:`, error.response.data);
        } else if (error.request) {
          console.error('❌ No response received:', error.request);
        } else {
          console.error('❌ Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  async getStocks(): Promise<StockPrice[]> {
    try {
      const response = await this.client.get<StockPrice[]>('/stocks');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch stocks: ${error}`);
    }
  }

  async getStockBySymbol(symbol: string): Promise<StockPrice> {
    try {
      const response = await this.client.get<StockPrice>(`/stocks/${symbol}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch stock ${symbol}: ${error}`);
    }
  }
}

export const stockApi = new StockApiClient();
