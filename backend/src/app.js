import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/usersRoutes.js";
import { connectToSocket } from "./controllers/socketMangers.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

// ✅ Set port
app.set("port", process.env.PORT || 8000);

// ✅ Fixed and safe CORS configuration
const allowedOrigins = [

  "https://apna-video-call-r69l.vercel.app/" // ✅ Your frontend deployed URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.options("*", cors()); // ✅ Allow preflight for all routes

// ✅ Middleware to parse JSON and form data
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// ✅ Routes
app.use("/api/v1/users", userRoutes);

// ✅ Connect to MongoDB and start server
const start = async () => {
  try {
    const connectionDb = await mongoose.connect(
      "mongodb+srv://shashiyadav1790:JMR2Obmb3VrP0tX6@cluster0.ndize.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log(`✅ MONGO Connected: ${connectionDb.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`🚀 Server is running on port ${app.get("port")}`);
    });
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
};

start();
