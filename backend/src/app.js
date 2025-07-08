import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/usersRoutes.js";
import { connectToSocket } from "./controllers/socketMangers.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);

// ✅ CORS FIXED HERE
const allowedOrigins = [
  "https://apnavideocall-81wl.onrender.com", // frontend URL
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

app.options("*", cors()); // ✅ For preflight requests

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

// ✅ Connect to Mongo and start server
const start = async () => {
  const connectionDb = await mongoose.connect("mongodb+srv://shashiyadav1790:JMR2Obmb3VrP0tX6@cluster0.ndize.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);

  server.listen(app.get("port"), () => {
    console.log("LISTENING ON PORT", app.get("port"));
  });
};

start();
