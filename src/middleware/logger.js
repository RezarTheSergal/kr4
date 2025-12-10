const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  const originalSend = res.send;
  res.send = function(data) {
    console.log(`[${timestamp}] Ответ: ${res.statusCode}`);
    originalSend.call(this, data);
  };

  next();
};

module.exports = loggerMiddleware;