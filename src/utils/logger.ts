type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  operation?: string;
  userId?: string;
  classId?: number;
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  private sanitizeData(data: any): any {
    if (!data) return data;
    
    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'auth',
      'email', 'phone', 'address', 'npsn'
    ];
    
    if (typeof data === 'object') {
      const sanitized = { ...data };
      for (const field of sensitiveFields) {
        if (field in sanitized) {
          sanitized[field] = '[REDACTED]';
        }
      }
      return sanitized;
    }
    
    return data;
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.isDevelopment && level === 'debug') return;
    
    const timestamp = new Date().toISOString();
    const sanitizedContext = context ? this.sanitizeData(context) : undefined;
    
    const logEntry = {
      timestamp,
      level,
      message,
      ...(sanitizedContext && { context: sanitizedContext })
    };
    
    console[level === 'debug' ? 'log' : level](JSON.stringify(logEntry));
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }
}

export const logger = new Logger();