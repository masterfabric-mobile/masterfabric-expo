interface Logger {
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

class AppLogger implements Logger {
  private isDevelopment = __DEV__;

  debug(message: string, ...args: any[]) {
    if (this.isDevelopment) {
      console.log(`🐛 DEBUG: ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.isDevelopment) {
      console.log(`ℹ️ INFO: ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    console.warn(`⚠️ WARN: ${message}`, ...args);
  }

  error(message: string, ...args: any[]) {
    console.error(`❌ ERROR: ${message}`, ...args);
  }
}

export const logger = new AppLogger();
