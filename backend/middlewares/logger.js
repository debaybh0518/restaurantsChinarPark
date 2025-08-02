const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    // Add file transport if needed
  ],
});

module.exports = (req, res, next) => {
  logger.info({
    method: req.method,
    url: req.originalUrl,
    user: req.user ? req.user.user_id : null,
    body: req.body,
  });
  next();
};