const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv").config();

// Database connection
const connectDB = require('./config/dbconfig');
const seedDefaultIndiaCountry = require('./app/helpers/insertIndia');

connectDB().then(() => seedDefaultIndiaCountry());

const app = express();
const port = process.env.PORT || 5050;

app.set('trust proxy', 1);

// const allowedOrigins = [
//   "http://localhost:4040",
//   "https://counsel-frontend-4mh3.vercel.app/",
//   "http://127.0.0.1:5503",
// ];

app.use(cors({
  // origin: allowedOrigins,
  origin: "*",
  credentials: true
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// ✅ express-rate-limit fix with safe keyGenerator
app.use(rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again in an hour",
  keyGenerator: (req, res) => {
    return req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
  }
}));

app.use(`/public/defult`, express.static(path.join(__dirname, `public/defult`)));
app.use('/cloudinary', require('./app/routes/createCloudinaryUpload'));

// Store SSE clients
const sseClients = new Set();

// SSE endpoint for streaming new enquiries
app.get('/api/enquiries/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.add(res);

  // Send keep-alive every 30 seconds
  const keepAlive = setInterval(() => {
    res.write(':keep-alive\n\n');
  }, 30000);

  // Remove client on close
  req.on('close', () => {
    sseClients.delete(res);
    clearInterval(keepAlive);
    res.end();
  });
});

// Make sseClients available to controllers
app.set('sseClients', sseClients);

// Default route
app.get('/', (req, res) => {
  res.json({ message: "Hello, Server Started" });
});

// Routes
app.use('/users', require('./app/routes/user'));
app.use('/blog', require('./app/routes/blogRouter'));
app.use('/services', require('./app/routes/serviceRoutes'));
app.use('/gallery', require('./app/routes/galleryRoutes'));
app.use('/enquiries', require('./app/routes/enquiry'));
app.use('/followUp', require('./app/routes/followUp'));
app.use('/countries', require('./app/routes/countryRoutes'));
app.use('/courses', require('./app/routes/courseRoutes'));
app.use('/college', require('./app/routes/collegeRouter'));
app.use('/intake', require('./app/routes/intakeRoutes'));
app.use('/userProfile', require('./app/routes/userProfile'));
app.use('/userroles', require('./app/routes/userRole'));
app.use('/orgType', require('./app/routes/orgType'));
app.use('/orgCategory', require('./app/routes/orgCategory'));
app.use('/productService', require('./app/routes/productServices'));
app.use('/supportType', require('./app/routes/supportType'));
app.use('/orgProfile', require('./app/routes/orgProfile'));
app.use('/contact', require('./app/routes/contactRoutes'));

// Server start
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
