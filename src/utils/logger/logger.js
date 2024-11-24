import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  handleExceptions: true,
  transports: [ new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize({all: true})),
    json: false
  })
  ],
  exitOnError: false
});

const log = (context, message, scope) => {
  const obj = {
    context,
    scope,
    message: message.toString()
  };
  logger.info(obj);
};

export default{
  log,
  logger
}