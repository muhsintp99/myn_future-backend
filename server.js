// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const rateLimit = require("express-rate-limit");
// const cookieParser = require("cookie-parser");
// const path = require("path");
// const dotenv = require("dotenv").config();

// // Database connection
// const connectDB = require("./config/dbconfig");
// const seedDefaultIndiaCountry = require("./app/helpers/insertIndia");
// const { insertDefaultAdmin } = require("./app/helpers/insertAdmin");

// const app = express();
// const port = process.env.PORT || 5050;

// app.set("trust proxy", 1);

// // const allowedOrigins = [
// //   "http://localhost:4040",
// //   "https://counsel-frontend-4mh3.vercel.app/",
// //   "http://127.0.0.1:5503",
// // ];

// app.use(
//   cors({
//     // origin: allowedOrigins,
//     origin: "*",
//     credentials: true,
//   })
// );

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cookieParser());

// // ✅ express-rate-limit with safe keyGenerator
// app.use(
//   rateLimit({
//     windowMs: 60 * 60 * 1000,
//     max: 1000,
//     message: "Too many requests from this IP, please try again in an hour",
//     keyGenerator: (req, res) => {
//       return (
//         req.headers["x-forwarded-for"] ||
//         req.ip ||
//         req.connection.remoteAddress
//       );
//     },
//   })
// );

// // Static files
// app.use(`/public/defult`, express.static(path.join(__dirname, `public/defult`)));
// app.use("/public", express.static(path.join(__dirname, "public")));

// // Store SSE clients
// const sseClients = new Set();

// // SSE endpoint for streaming new enquiries
// app.get("/api/enquiries/stream", (req, res) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");
//   res.flushHeaders();

//   sseClients.add(res);

//   // Send keep-alive every 30 seconds
//   const keepAlive = setInterval(() => {
//     res.write(":keep-alive\n\n");
//   }, 30000);

//   // Remove client on close
//   req.on("close", () => {
//     sseClients.delete(res);
//     clearInterval(keepAlive);
//     res.end();
//   });
// });

// // Make sseClients available to controllers
// app.set("sseClients", sseClients);

// // Default route
// app.get("/", (req, res) => {
//   res.json({ message: "Hello, Server Started in Myn Future" });
// });

// // Routes
// app.use("/users", require("./app/routes/user"));
// app.use("/blog", require("./app/routes/blogRouter"));
// app.use("/college", require("./app/routes/collegeRouter"));
// app.use("/contact", require("./app/routes/contactRoutes"));
// app.use("/countries", require("./app/routes/countryRoutes"));
// app.use("/states", require("./app/routes/stateRoutes"));
// app.use("/courses", require("./app/routes/courseRoutes"));
// app.use("/enquiries", require("./app/routes/enquiry"));
// app.use("/followUp", require("./app/routes/followUp"));
// app.use("/gallery", require("./app/routes/galleryRoutes"));
// app.use("/intake", require("./app/routes/intakeRoutes"));
// app.use("/services", require("./app/routes/serviceRoutes"));

// // 🚀 Server start with auto free-port retry
// const startServer = async (retryPort = port) => {
//   try {
//     await connectDB();
//     // await seedDefaultIndiaCountry();
//     await insertDefaultAdmin();

//     const server = app.listen(retryPort, () => {
//       const baseUrl = process.env.BASE_URL || `http://localhost:${retryPort}`;
//       console.log(`🚀 Server is running at ${baseUrl}`);
//     });

//     server.on("error", (err) => {
//       if (err.code === "EADDRINUSE") {
//         console.warn(`⚠️ Port ${retryPort} is busy, trying ${retryPort + 1}...`);
//         startServer(retryPort + 1); // retry with next port
//       } else {
//         console.error("❌ Failed to start server:", err.message);
//         process.exit(1);
//       }
//     });
//   } catch (error) {
//     console.error("❌ Startup error:", error.message);
//     process.exit(1);
//   }
// };

// startServer();


// server.js
// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv").config();

// Database connection & helpers
const connectDB = require("./config/dbconfig");
const seedDefaultIndiaCountry = require("./app/helpers/insertIndia");
const { insertDefaultAdmin } = require("./app/helpers/insertAdmin");

const app = express();
const port = process.env.PORT || 5050;

// ======= CORS Configuration =======
const allowedOrigins = [
  "https://dashboard.mynfuture.com",
  "https://www.mynfuture.ae",
  "https://mynfuture.ae",
  "http://localhost:4040",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser requests
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(
          new Error(`CORS blocked for origin: ${origin}`),
          false
        );
      }
      return callback(null, true);
    },
    credentials: true, // allow cookies/auth headers
  })
);

// ======= Body Parser Configuration =======
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// ======= Cookie Parser =======
app.use(cookieParser());

// ======= Rate Limiter =======
app.use(
  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000,
    message: "Too many requests from this IP, please try again in an hour",
    keyGenerator: (req) => req.headers["x-forwarded-for"] || req.ip,
  })
);

// ======= Static Files =======
app.use(
  `/public/defult`,
  express.static(path.join(__dirname, `public/defult`))
);
app.use("/public", express.static(path.join(__dirname, "public")));

// ======= SSE Clients =======
const sseClients = new Set();

app.get("/api/enquiries/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  sseClients.add(res);

  const keepAlive = setInterval(() => {
    res.write(":keep-alive\n\n");
  }, 30000);

  req.on("close", () => {
    sseClients.delete(res);
    clearInterval(keepAlive);
    res.end();
  });
});

app.set("sseClients", sseClients);

// ======= Default Route =======
app.get("/", (req, res) => {
  res.json({ message: "Hello, Server Started in Myn Future" });
});

// ======= Routes =======
app.use("/users", require("./app/routes/user"));
app.use("/blog", require("./app/routes/blogRouter"));
app.use("/college", require("./app/routes/collegeRouter"));
app.use("/contact", require("./app/routes/contactRoutes"));
app.use("/countries", require("./app/routes/countryRoutes"));
app.use("/states", require("./app/routes/stateRoutes"));
app.use("/courses", require("./app/routes/courseRoutes"));
app.use("/enquiries", require("./app/routes/enquiry"));
app.use("/followUp", require("./app/routes/followUp"));
app.use("/gallery", require("./app/routes/galleryRoutes"));
app.use("/intake", require("./app/routes/intakeRoutes"));
app.use("/services", require("./app/routes/serviceRoutes"));

// ======= Global Error Handler for Large Payloads =======
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request payload is too large. Max 50MB allowed.",
    });
  }
  if (err.message && err.message.startsWith("CORS blocked")) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }
  console.error("Unhandled server error:", err);
  res.status(500).json({ success: false, message: "Server error" });
});

// ======= Start Server with Auto Port Retry =======
const startServer = async (retryPort = port) => {
  try {
    await connectDB();
    // await seedDefaultIndiaCountry(); // optional
    await insertDefaultAdmin();

    const server = app.listen(retryPort, () => {
      const baseUrl = process.env.BASE_URL || `http://localhost:${retryPort}`;
      console.log(`🚀 Server is running at ${baseUrl}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.warn(
          `⚠️ Port ${retryPort} is busy, trying ${retryPort + 1}...`
        );
        startServer(retryPort + 1);
      } else {
        console.error("❌ Failed to start server:", err.message);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("❌ Startup error:", error.message);
    process.exit(1);
  }
};

startServer();
