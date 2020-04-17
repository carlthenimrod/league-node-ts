import fs from 'fs';
import path from 'path';
import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf } = format;

const baseDir = 'log/';
if (!fs.existsSync(baseDir)) { fs.mkdirSync(baseDir); }

const messageFormat = printf(info => {
  const { 
    message, 
    level, 
    timestamp, 
    action, 
    status, 
    path
  } = info;

  return [
    `${ timestamp }`,
    `   ${ level.toUpperCase() }: ${ action } "${ path }" ${ status }`,
    `   "${ message }"`
  ].join(' ');
});

const dirname = path.join(baseDir, '%DATE%/');

const httpOnly = format(info => 
  info.level === 'http'
    ? info
    : false
);

const logger = createLogger({
  format: combine(
    timestamp(),
    messageFormat
  ),
  transports: [
    new transports.DailyRotateFile({
      level: 'debug',
      dirname,
      filename: 'all.log'
    }),
    new transports.Console({
      level: 'error'
    }),
    new transports.DailyRotateFile({
      level: 'error',
      dirname,
      filename: 'error.log'
    }),
    new transports.DailyRotateFile({
      level: 'http',
      dirname,
      filename: 'http.log',
      format: httpOnly()
    })
  ]
});

logger.exceptions.handle(
  new transports.Console({
    level: 'error'
  })
);

export default logger;