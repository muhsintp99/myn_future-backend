// const mongoose = require("mongoose");
// require("dotenv").config();

// const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/counsel";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGODB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ MongoDB Connected Successfully!");
//   } catch (error) {
//     console.error("❌ MongoDB Connection Failed:", error.message);
//     process.exit(1); // Exit process with failure
//   }
// };

// module.exports = connectDB;


const mongoose = require("mongoose");
require("dotenv").config();
require("saslprep");

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/counsel";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
