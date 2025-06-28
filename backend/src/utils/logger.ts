import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Add colors to winston
winston.addColors(colors);

// Define format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level}]: ${message}${metaString}`;
  })
);

// Define format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format: fileFormat,
  defaultMeta: {
    service: 'formpulse-api',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Error log file
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Combined log file
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 10,
      tailable: true
    }),
    
    // Console output (only in development)
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: consoleFormat
      })
    ] : [])
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'exceptions.log'),
      maxsize: 10485760,
      maxFiles: 5
    })
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'rejections.log'),
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
});

// Create logs directory if it doesn't exist
import fs from 'fs';
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Add request logging middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'error' : 'http';
    
    logger.log(logLevel, 'HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id
    });
  });
  
  next();
};

// Security logging functions
export const logSecurityEvent = (event: string, details: any, req?: any) => {
  logger.warn(`Security Event: ${event}`, {
    event,
    details,
    ip: req?.ip,
    userAgent: req?.get('User-Agent'),
    userId: req?.user?.id,
    timestamp: new Date().toISOString()
  });
};

export const logAuthEvent = (event: string, userId: string, details: any = {}) => {
  logger.info(`Auth Event: ${event}`, {
    event,
    userId,
    details,
    timestamp: new Date().toISOString()
  });
};

export const logBusinessEvent = (event: string, userId: string, details: any = {}) => {
  logger.info(`Business Event: ${event}`, {
    event,
    userId,
    details,
    timestamp: new Date().toISOString()
  });
};

// Performance logging
export const logPerformance = (operation: string, duration: number, details: any = {}) => {
  const level = duration > 5000 ? 'warn' : 'info'; // Warn if operation takes more than 5 seconds
  
  logger.log(level, `Performance: ${operation}`, {
    operation,
    duration: `${duration}ms`,
    details,
    timestamp: new Date().toISOString()
  });
};

// Database operation logging
export const logDatabaseOperation = (operation: string, table: string, duration: number, details: any = {}) => {
  logger.debug(`Database: ${operation}`, {
    operation,
    table,
    duration: `${duration}ms`,
    details,
    timestamp: new Date().toISOString()
  });
};

// API usage logging
export const logApiUsage = (endpoint: string, userId: string, apiKey?: string) => {
  logger.info('API Usage', {
    endpoint,
    userId,
    apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : undefined,
    timestamp: new Date().toISOString()
  });
};

// Error with context logging
export const logError = (error: Error, context: any = {}) => {
  logger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
};

// Structured logging for different environments
if (process.env.NODE_ENV === 'production') {
  // In production, add additional transports for monitoring services
  
  // Example: Add Datadog or other monitoring service transport
  // logger.add(new DatadogWinston({
  //   apikey: process.env.DATADOG_API_KEY,
  //   hostname: process.env.HOSTNAME,
  //   service: 'formpulse-api',
  //   ddsource: 'nodejs'
  // }));
  
  // Example: Add Slack notifications for critical errors
  // logger.add(new SlackHook({
  //   hookUrl: process.env.SLACK_WEBHOOK_URL,
  //   level: 'error',
  //   channel: '#alerts'
  // }));
}

export { logger };

// Export a function to gracefully close logger
export const closeLogger = () => {
  return new Promise<void>((resolve) => {
    logger.on('finish', () => {
      resolve();
    });
    logger.end();
  });
}; 