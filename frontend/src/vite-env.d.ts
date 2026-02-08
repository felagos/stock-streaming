
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_STOCK_UPDATE_INTERVAL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
