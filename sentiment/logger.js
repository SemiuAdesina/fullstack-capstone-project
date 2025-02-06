const pino = require('pino');

let logger;

if (process.env.NODE_ENV !== 'production') {
    // In non-production environments, log to the console using pino-pretty
    logger = pino({
        level: 'debug',
        transport: {
            target: 'pino-pretty',  // Pretty print for development
            options: {
                colorize: true,     // Adds color for better readability
            },
        },
    });
} else {
    // In production, use default logging without pretty print
    logger = pino();
}

module.exports = logger;
