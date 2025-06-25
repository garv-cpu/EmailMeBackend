import express from "express";
import cors from "cors";
import generateEmail from "./generateEmail.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const { context } = req.body;
  console.log("➡️ Received context:", context); // Debug log

  if (!context) {
    console.log("❌ No context provided");
    return res.status(400).json({ error: 'Context is required' });
  }

  try {
    const prompt = `Write a professional email for this situation: ${context}`;
    const aiEmail = await generateEmail(prompt);

    console.log("✅ AI Email generated:", aiEmail);
    res.json({ email: aiEmail });
  } catch (err) {
    console.error("❌ Error generating email:", err);
    res.status(500).json({ error: "AI generation failed" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
