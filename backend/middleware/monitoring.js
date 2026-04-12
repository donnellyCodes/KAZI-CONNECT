// Monitoring and analytics middleware

const monitoring = (req, res, next) => {
    const start = Date.now();
    
    // Log request details
    console.log(`${req.method} ${req.originalUrl} - ${req.ip}`);
    
    // Override res.end to track response time
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
        const duration = Date.now() - start;
        
        // Log response details
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
        
        // Track metrics (in production, send to monitoring service)
        if (process.env.NODE_ENV === 'production') {
            trackMetrics(req, res, duration);
        }
        
        originalEnd.call(this, chunk, encoding);
    };
    
    next();
};

const trackMetrics = (req, res, duration) => {
    // In production, send metrics to monitoring service
    // Example: Prometheus, DataDog, etc.
    const metrics = {
        method: req.method,
        route: req.route?.path || req.originalUrl,
        statusCode: res.statusCode,
        duration,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent'),
        ip: req.ip
    };
    
    // Log to file or send to monitoring service
    console.log('METRICS:', JSON.stringify(metrics));
};

const healthCheck = async (req, res) => {
    try {
        // Check database connection
        const { sequelize } = require('../config/db');
        await sequelize.authenticate();
        
        // Check AI service
        const axios = require('axios');
        const aiHealth = await axios.get(`${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/health`, {
            timeout: 5000
        }).catch(() => null);
        
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            database: 'connected',
            aiService: aiHealth ? 'connected' : 'disconnected',
            version: process.env.npm_package_version || '1.0.0'
        };
        
        res.status(200).json(health);
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
};

module.exports = {
    monitoring,
    healthCheck
};
