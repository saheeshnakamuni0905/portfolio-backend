const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: ['https://saheeshnakamuni.github.io'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());


// ==== Email Validation Route (Abstract API) ====
app.post('/api/validate-email', async (req, res) => {
  console.log("RQ");
  const { email } = req.body;
  const apiKey = process.env.ABSTRACT_API_KEY;
  try {
    const response = await axios.get('https://emailvalidation.abstractapi.com/v1/', {
      params: {
        api_key: apiKey,
        email: email.trim(), 
      }
    });

    const { is_valid_format, is_disposable_email } = response.data;

    if (!is_valid_format.value || is_disposable_email.value) {
      return res.status(400).json({ error: 'Invalid or disposable email.' });
    }

    res.json({ valid: true });
  } catch (error) {
    console.error("Validation error:", error.message);
    res.status(500).json({ error: 'Email validation failed.' });
  }
});

// const frontendPath = path.join(__dirname, '../frontend/build/');
// console.log(frontendPath);
// app.use(express.static(frontendPath));

// app.use(express.static(path.join(__dirname, '../frontend/build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
