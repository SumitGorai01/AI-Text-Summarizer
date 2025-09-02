require('dotenv').config();
const express = require('express');
const path = require('path');
const summarizeText = require('./summarize.js');

const app = express();
app.use(express.json());

// ✅ Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Serve index.html on root (important for Vercel)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route
app.post('/summarize', (req, res) => {
  const text = req.body.text_to_summarize;

  summarizeText(text)
    .then(response => res.send(response))
    .catch(error => {
      console.error(error.message);
      res.status(500).send('Error summarizing text');
    });
});

// Export for Vercel
module.exports = app;

// Localhost run
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
