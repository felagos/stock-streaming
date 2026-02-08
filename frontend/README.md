# Stock Streaming Frontend

Frontend moderna en **React** con **TypeScript** y **Bun** para un dashboard de precios de acciones en tiempo real.

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias con Bun
bun install

# 2. Iniciar servidor de desarrollo
bun run dev

# 3. Abre http://localhost:3000 en tu navegador
```

## 📋 Requisitos

- **Bun** >= 1.0 ([Instalar Bun](https://bun.sh))
- **Node.js** compatible (opcional, Bun es suficiente)

## 📦 Instalación

```bash
# Instalar Bun (si aún no lo tienes)
curl -fsSL https://bun.sh/install | bash  # macOS/Linux
# o
irm bun.sh/install.ps1 | iex              # Windows (PowerShell)

# Instalar dependencias del proyecto
bun install
```

## 🔥 Comandos Disponibles

### Desarrollo
```bash
bun run dev              # Servidor con hot reload
```

### Producción
```bash
bun run build            # Compilar TypeScript
bun run preview          # Previsualizar build
```

### Calidad de Código
```bash
bun run type-check       # Verificar tipos TypeScript
bun run format           # Formatear con Prettier
bun run format:check     # Verificar formato
```

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── StockGrid.tsx   # Grid de acciones
│   │   ├── StockGrid.css
│   │   ├── StockCard.tsx   # Tarjeta individual de stock
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── useStocks.ts    # Hook para obtener stocks
│   │
│   ├── services/            # Llamadas API
│   │   └── api.ts          # Cliente API con axios
│   │
│   ├── types/               # Tipos TypeScript centralizados
│   │   └── index.ts
│   │
│   ├── utils/               # Funciones de utilidad
│   │   └── logger.ts       # Sistema de logging
│   │
│   ├── App.tsx              # Componente raíz
│   ├── App.css
│   ├── index.tsx            # Punto de entrada
│   └── index.css            # Estilos globales
│
├── index.html               # Template HTML
├── public/                  # Archivos estáticos
│
├── package.json             # Dependencias
├── tsconfig.json            # Config TypeScript
├── bunfig.toml             # Config Bun
├── .prettierrc.json        # Config Prettier
├── .env.example            # Ejemplo de env vars
├── Dockerfile              # Para containerización
│
├── README.md               # Este archivo
├── FRONTEND_GUIDE.md       # Guía detallada de desarrollo
└── .gitignore              # Archivos ignorados por git
```

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env.local` en la raíz del frontend:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_STOCK_UPDATE_INTERVAL=5000
```

Ver [.env.example](./.env.example) para más ejemplos.

### TypeScript

Configurado con:
- ESNext modules
- React JSX
- Type-safe strict mode
- Path aliases: `@/*` → `./src/*`

Ver [tsconfig.json](./tsconfig.json) para detalles.

### Prettier

Formato de código automático con reglas en [.prettierrc.json](./.prettierrc.json).

## 📚 Características

### ✨ Frontend
- **React 18.2** - UI library moderna
- **TypeScript 5.3** - Type safety total
- **Bun 1.0+** - Runtime rápido & package manager
- **Axios** - Cliente HTTP
- **CSS Grid** - Responsive design
- **SVG Charts** - Gráficos vectoriales
- **Hot Reload** - Desarrollo sin refrescar

### 🎨 UI/UX
- Interfaz moderna y atractiva
- Responsive en todos los dispositivos
- Animaciones suaves
- Sistema de colores profesional
- Indicadores de estado en tiempo real

### 📊 Datos en Tiempo Real
- Actualizaciones automáticas cada 5 segundos
- Historial de precios en gráficos
- Cache inteligente de estado
- Manejo robusto de errores

## 🔌 API Integration

El frontend se conecta a:
```
GET http://localhost:8080/api/stocks
```

### Cliente API

Ubicado en [src/services/api.ts](./src/services/api.ts):

```typescript
import { stockApi } from '@/services/api';

// Obtener todos los stocks
const stocks = await stockApi.getStocks();

// Obtener un stock específico
const apple = await stockApi.getStockBySymbol('AAPL');
```

Con interceptores para:
- Logging automático de requests/responses
- Manejo centralizado de errores
- Timeout configurado

## 🪝 Custom Hooks

### useStocks

Hook para obtener y actualizar stocks automáticamente:

```typescript
import { useStocks } from '@/hooks/useStocks';

function MyComponent() {
  const { stocks, loading, error, refetch } = useStocks(5000);
  
  return (
    <>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      {stocks.map(stock => (
        <div key={stock.symbol}>{stock.symbol}: ${stock.price}</div>
      ))}
      <button onClick={refetch}>Refrescar</button>
    </>
  );
}
```

## 🛠️ Desarrollo

### Hot Module Reloading

Cambios en `.tsx`, `.ts` o `.css` se reflejan al instante sin refrescar:

```bash
bun run dev  # Ya tiene HMR habilitado
```

### Debugging

**Navegador DevTools:**
1. Abre DevTools (F12)
2. Pestaña "Console" para logs
3. Pestaña "React" con React DevTools extension

**VSCode:**
1. Instala extensiones recomendadas
2. Debug con breakpoints en editor

### Logger Utility

Sistema de logging integrado:

```typescript
import { logger } from '@/utils/logger';

logger.debug('Debug msg');
logger.info('Info msg');
logger.warn('Warning');
logger.error('Error', errorObj);
```

Logs formateados con colores en consola.

## 🐳 Docker

### Build Image
```bash
docker build -t stock-frontend:latest .
```

### Run Container
```bash
docker run -p 3000:3000 stock-frontend:latest
```

Con Docker Compose:
```bash
docker-compose up frontend
```

## 📖 Documentación Extendida

- [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md) - Guía completa de desarrollo
- [../SETUP.md](../SETUP.md) - Setup del sistema completo
- [../README.md](../README.md) - README del proyecto

## ⚡ Optimizaciones

- Tree-shaking automático con Bun
- Lazy loading de componentes
- Memoización inteligente
- Polling eficiente de datos
- CSS modular por componente

## 🔒 Seguridad

- Type checking estricto
- Validación de entrada
- CORS configurado en backend
- Sin datos sensibles en variables públicas

## 📝 Convenciones de Código

- **Nombres de componentes:** PascalCase (`StockGrid.tsx`)
- **Nombres de archivos:** camelCase excepto componentes
- **Tipos:** Centralizados en `@/types`
- **Servicios:** Clases singleton en `@/services`
- **Hooks:** Nombres con `use` en `@/hooks`
- **Utilitarios:** Funciones puras en `@/utils`

## 🚨 Troubleshooting

### "Module not found '@/types'"

Reinicia servidor: `Ctrl+C` y `bun run dev`

### "Cannot connect to api"

Verifica:
1. API Gateway corriendo en puerto 8080
2. Variable `REACT_APP_API_URL` correcta
3. CORS habilitado en backend

### Port 3000 en uso

```bash
# Linux/Mac
lsof -i :3000 | grep -v PID | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📚 Recursos

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Bun Docs](https://bun.sh/docs)
- [Axios Docs](https://axios-http.com)

## 📄 License

MIT

## 👥 Contributing

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/NewFeature`)
3. Commit cambios (`git commit -m 'Add NewFeature'`)
4. Push (`git push origin feature/NewFeature`)
5. Abre un Pull Request

---

**Construido con ❤️ usando React, TypeScript y Bun**
