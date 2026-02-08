
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

const getCurrentTimestamp = (): string => {
  return new Date().toLocaleTimeString('es-ES');
};

const getStyles = (level: LogLevel): { color: string; bgColor: string } => {
  const styles = {
    [LogLevel.DEBUG]: { color: '#666', bgColor: '#f0f0f0' },
    [LogLevel.INFO]: { color: '#0066cc', bgColor: '#e6f2ff' },
    [LogLevel.WARN]: { color: '#ff6600', bgColor: '#fff3e6' },
    [LogLevel.ERROR]: { color: '#cc0000', bgColor: '#ffe6e6' },
  };
  return styles[level];
};

const log = (level: LogLevel, message: string, data?: any) => {
  const timestamp = getCurrentTimestamp();
  const styles = getStyles(level);
  const prefix = `[${timestamp}] ${level}`;

  if (data) {
    console.log(
      `%c${prefix}:%c ${message}`,
      `color: white; background-color: ${styles.color}; padding: 2px 6px; border-radius: 3px; font-weight: bold;`,
      `color: ${styles.color}; font-weight: bold;`
    );
    console.log(data);
  } else {
    console.log(
      `%c${prefix}:%c ${message}`,
      `color: white; background-color: ${styles.color}; padding: 2px 6px; border-radius: 3px; font-weight: bold;`,
      `color: ${styles.color};`
    );
  }
};

export const logger = {
  debug: (message: string, data?: any) => log(LogLevel.DEBUG, message, data),
  info: (message: string, data?: any) => log(LogLevel.INFO, message, data),
  warn: (message: string, data?: any) => log(LogLevel.WARN, message, data),
  error: (message: string, data?: any) => log(LogLevel.ERROR, message, data),
};
