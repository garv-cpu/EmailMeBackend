// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { CronJob } from "cron";
import generateEmail from "./generateEmail.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ⏱️ In-memory cache (could be replaced with Redis for production)
const cachedEmails = new Map(); // Key: context, Value: AI email

// 🕒 Cron job: Pre-generate emails for predefined contexts
const predefinedContexts = [
  "Cold Email",
  "Client Follow-up",
  "Apology Email",
  "Feedback Request",
  "Thank You Email",
];

const job = new CronJob("*/30 * * * * *", async () => {
  console.log("🔄 Running cron job to pre-generate emails...");

  for (const context of predefinedContexts) {
    const prompt = `Write a professional email for this situation: ${context}`;
    try {
      const aiEmail = await generateEmail(prompt);
      cachedEmails.set(context, aiEmail);
      console.log(`✅ Cached: ${context}`);
    } catch (err) {
      console.error(`❌ Error caching "${context}":`, err.message);
    }
  }
});

job.start();

// 🧠 API to return cached email instantly
app.post('/api/generate', async (req, res) => {
  const { context } = req.body;
  if (!context) return res.status(400).json({ error: "Context is required" });

  const cached = cachedEmails.get(context);
  if (cached) {
    console.log("⚡ Instant response from cache");
    return res.json({ email: cached });
  }

  // fallback if not cached
  try {
    const prompt = `Write a professional email for this situation: ${context}`;
    const aiEmail = await generateEmail(prompt);
    return res.json({ email: aiEmail });
  } catch (err) {
    return res.status(500).json({ error: "AI generation failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
