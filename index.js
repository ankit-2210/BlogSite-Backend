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


app.use(cors({
    origin: [
        "https://blog-site-frontent-1ew4-7cp4m7s41-ankit2210s-projects.vercel.app",
        "http://localhost:5173"

    ],
    credentials: true
}));

// app.use(cors({
//     origin: [
//         "http://localhost:5173"
//     ],
//     credentials: true
// }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api', Routes);

const PORT = process.env.PORT || 8000;

Connection()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect DB:", err);
    });

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});

// let isConnected = false;

// const connectDB = async () => {
//     if (!isConnected) {
//         await Connection();
//         isConnected = true;
//     }
// };

// export default async function handler(req, res) {
//     await connectDB();
//     return serverless(app)(req, res);
// }