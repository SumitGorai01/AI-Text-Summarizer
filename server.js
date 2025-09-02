require("dotenv").config();
const express = require("express");
const path = require("path");
const summarizeText = require("./summarize.js");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Summarize endpoint
app.post("/summarize", async (req, res) => {
  const { text_to_summarize, params } = req.body;

  try {
    const summary = await summarizeText(text_to_summarize, params);
    res.send(summary);
  } catch (err) {
    res.status(500).send("Error summarizing text: " + err.message);
  }
});

// Export for Vercel
module.exports = app;

// Local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
