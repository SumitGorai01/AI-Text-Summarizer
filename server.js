require('dotenv').config();

const accessToken = process.env.ACCESS_TOKEN;
// console.log(accessToken);  // Prints your access token

const express = require('express');
const app = express();
const port = 3000;
const summarizeText = require('./summarize.js');

// Parses JSON bodies (as sent by API clients)
app.use(express.json());

// Serves static files from the 'public' directory
app.use(express.static('public'));

// Handle POST requests to the '/summarize' endpoint

app.post('/summarize', (req, res) => {
 // get the text_to_summarize property from the request body
  const text = req.body.text_to_summarize;

 // call your summarizeText function, passing in the text from the request
  summarizeText(text) 
    .then(response => {
       res.send(response); // Send the summary text as a response to the client
    })
    .catch(error => {
      console.log(error.message);
    });
});
// ✅ For Vercel: export app (so vercel.json can use it)
module.exports = app;

// ✅ For localhost: only start server if not running on Vercel
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}