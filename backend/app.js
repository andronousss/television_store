const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const tvRoutes = require("./routes/tvRoutes");
const orderRoutes = require("./routes/orderRoutes");
const statsRoutes = require("./routes/stats");
const { register, metricsMiddleware } = require("./metrics");
require("dotenv").config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(metricsMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

app.use("/api/auth", authRoutes);
app.use("/api/tvs", tvRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Television Store API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      tvs: "/api/tvs",
      orders: "/api/orders",
      stats: "/api/stats"
    }
  });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.path 
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: "Validation Error",
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: "Invalid ID format"
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate value",
      field: Object.keys(err.keyPattern)[0]
    });
  }
  
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;