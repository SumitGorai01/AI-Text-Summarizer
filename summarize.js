const axios = require("axios");

async function summarizeText(text, params = { max_length: 100, min_length: 40 }) {
  let data = JSON.stringify({
    inputs: text,
    parameters: params,
  });

  let config = {
    method: "post",
    url: "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.ACCESS_TOKEN,
    },
    data: data,
  };

  try {
    const response = await axios.request(config);

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data[0].summary_text;
  } catch (err) {
    console.error("Summarization error:", err.message);
    throw err;
  }
}

module.exports = summarizeText;
