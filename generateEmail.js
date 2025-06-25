import axios from "axios";

async function generateEmail(prompt) {
  const headers = {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:5173', // change this to your domain if deployed
    'X-Title': 'MailFlow AI',
  };

  const data = {
    model: "mistralai/mistral-7b-instruct", // or mixtral-8x7b, phi-2, etc.
    messages: [
      {
        role: "system",
        content: "You are a professional email assistant. Write polished, formal, and helpful emails.",
      },
      {
        role: "user",
        content: prompt,
      }
    ],
  };

  try {
    const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", data, { headers });
    const reply = res.data.choices[0]?.message?.content;
    console.log("📩 OpenRouter AI Reply:", reply);
    return reply || "No output";
  } catch (err) {
    console.error("❌ OpenRouter Error:", err.response?.data || err.message);
    return "Error generating email";
  }
}

export default generateEmail;
