import express from "express";
import {createServer} from "node:http";
import {Server} from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./controllers/socketMangers.js";
import userRoutes from "./routes/usersRoutes.js"
 

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set('port',(process.env.PORT || 3000))



const corsOptions = {
    origin: 'https://apnavideocall-81wl.onrender.com', // Allow specific origin
    methods: ['GET', 'POST'], // Allow specific HTTP methods
    credentials: true, // Allow credentials (e.g., cookies, authorization headers)
};

app.use(cors(corsOptions));

// Other server setup

app.use(cors())
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit: "40kb",extended: true}));

app.use("/api/v1/users",userRoutes)

const start = async(req,res)=>{

    const connectionDb = await mongoose.connect("mongodb+srv://shashiyadav1790:JMR2Obmb3VrP0tX6@cluster0.ndize.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log(`MONGODB CONNECTION: ${connectionDb.connection.host}`);

    server.listen(app.get("port"),(req,res)=>{
        console.log("listening on port");
    })
}
start();