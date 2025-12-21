import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import transactionRouter from "./routes/transactionRoute.js";
import rateLimiter from "./middleware/rateLimiter.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") job.start();

// middleware
app.use(rateLimiter);
app.use(express.json()); // Middleware to parse JSON request bodies

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running", status: "OK" });
});

async function initDb() {
  try {
    // Test the connection by querying the database
    const result = await sql`CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Table created successfully:", result);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); //status code 1 means failure and 0 means success
  }
}
// middleware to apply rate limiter to transaction routes
app.use("/api/transactions", transactionRouter);

initDb().then(() => {
  app.listen(process.env.PORT || 5001, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
