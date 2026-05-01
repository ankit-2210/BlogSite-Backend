import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import Connection from "./db/conn.js";
import Routes from "./routers/route.js";
import serverless from "serverless-http";

dotenv.config();

const app = express();

app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

const allowedOrigin =
    process.env.CLIENT_URL ||
    "http://localhost:5173";

app.use(
    cors({
        origin: allowedOrigin,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);

app.options("*", cors());


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api', Routes);

// const PORT = process.env.PORT || 8000;

// Connection()
//     .then(() => {
//         app.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`);
//         });
//     })
//     .catch((err) => {
//         console.error("Failed to connect DB:", err);
//     });

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(err.status || 500).json({
//         message: err.message || "Internal Server Error"
//     });
// });

let isConnected = false;

const connectDB = async () => {
    if (!isConnected) {
        await Connection();
        isConnected = true;
        console.log("MongoDB connected");
    }
};

export default async function handler(req, res) {
    try {
        await connectDB();
        return serverless(app)(req, res);
    } catch (error) {
        console.error("Serverless error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}