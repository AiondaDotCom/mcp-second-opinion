import winston from 'winston';
import { loadConfig } from '../config/loader.js';

const config = loadConfig();

const logger = winston.createLogger({
  level: config.logging.level,
  silent: !config.logging.enabled,
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export default logger;