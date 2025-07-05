const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Use a supported model
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

app.post("/api/gemini", async (req, res) => {
  const { message } = req.body;

  try {
    const result = await model.generateContent(message);
    const response = result.response.text();
    res.json({ response });
  } catch (error) {
    console.error("Gemini SDK Error:", error?.message || error);
    res.status(500).json({ error: "Failed to get response from Gemini." });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
