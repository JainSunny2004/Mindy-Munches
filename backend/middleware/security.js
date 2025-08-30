const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different rate limits for different endpoints
const rateLimiters = {
  general: createRateLimit(15 * 60 * 1000, 100, 'Too many requests'),
  auth: createRateLimit(15 * 60 * 1000, 5, 'Too many authentication attempts'),
  payment: createRateLimit(15 * 60 * 1000, 10, 'Too many payment requests'),
};

// Security middleware function
const applySecurityMiddleware = (app) => {
  // Set security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'", "checkout.razorpay.com"],
        connectSrc: ["'self'", "api.razorpay.com"],
      },
    },
  }));

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // Data sanitization against XSS
  app.use(xss());

  // Prevent parameter pollution
  app.use(hpp({
    whitelist: ['sort', 'fields', 'page', 'limit', 'category']
  }));

  return rateLimiters;
};

module.exports = { applySecurityMiddleware, rateLimiters };
