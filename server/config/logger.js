import winston from 'winston';
import { format } from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = format;

const logDir = path.join(process.cwd(), 'logs');

const fileFormat = combine(
    timestamp({ format: "DD-MMM-YYYY HH:mm:ss:ms" }),
    printf(({ level, message, timestamp, stack }) => {
        if (stack) {
            return `${timestamp} [${level}]: ${message}\n${stack}`;
        }
        return `${timestamp} [${level}]: ${message}`;
    })
);

const consoleFormat = combine(
    colorize({ all: true }),
    timestamp({ format: "DD-MMM-YYYY HH:mm:ss:ms" }),
    printf(({ level, message, timestamp, stack }) => {
        if (stack) {
            return `${timestamp} [${level}]: ${message}\n${stack}`;
        }
        return `${timestamp} [${level}]: ${message}`;
    })
);

const logger = winston.createLogger({
    level: 'info',
    format: fileFormat,
    transports: [
        new winston.transports.Console({
            format: consoleFormat
        }),
        
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            level: 'info',
            format: fileFormat
        }),
        
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            format: fileFormat
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, 'exceptions.log')
        })
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, 'rejections.log')
        })
    ]
});

const customLogger = {
    info: (message, meta) => {
        logger.info(message, meta);
    },
    error: (message, meta) => {
        if (meta && meta.error) {
            const sanitizedError = { ...meta.error };
            delete sanitizedError.request;
            delete sanitizedError.response;
            
            if (sanitizedError.config) {
                sanitizedError.config = {
                    url: sanitizedError.config?.url,
                    method: sanitizedError.config?.method
                };
            }
            
            logger.error(message, { ...meta, error: sanitizedError });
        } else {
            logger.error(message, meta);
        }
    },
    warn: (message, meta) => {
        logger.warn(message, meta);
    },
    debug: (message, meta) => {
        logger.debug(message, meta);
    }
};

export default customLogger;