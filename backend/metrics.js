const promClient = require("prom-client");

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestsTotal = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0],
  registers: [register],
});

function metricsMiddleware(req, res, next) {
  if (req.path === "/metrics") return next();
  const start = Date.now();
  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path.replace(/\/[a-f0-9]{24}/g, "/:id");
    const labels = { method: req.method, route, status: res.statusCode };
    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, duration);
  });
  next();
}

module.exports = { register, metricsMiddleware };