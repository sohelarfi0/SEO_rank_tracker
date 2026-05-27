import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import rankRouter from "./routes/rankRoutes.js";
import analysisRouter from "./routes/analysisRoutes.js";
import { startRankTrackingCron } from "./cron/rankTrackingCron.js";

connectDB()

const app = express();


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parser
app.use(express.json());

app.get('/', (req, res) => res.send("Server is running"))
app.use('/api/auth', authRouter);
app.use('/api/rank', rankRouter);
app.use('/api/analysis', analysisRouter);

startRankTrackingCron()

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))