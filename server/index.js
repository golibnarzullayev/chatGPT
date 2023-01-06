const { Configuration, OpenAIApi } = require('openai');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const configration = new Configuration({
   organization: process.env.ORGANIZATION,
   apiKey: process.env.APIKEY
})

const openai = new OpenAIApi(configration);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/', async (req, res) => {
   try {
      const { message } = req.body;
      const response = await openai.createCompletion({
         model: "text-davinci-003",
         prompt: message,
         max_tokens: 4050,
         temperature: 0
      })
      res.status(201).json({ message: response.data.choices[0].text, type: 'ai'})
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
})

const port = 3001;

app.listen(port, () => {
   console.log(`Server running on port: ${port}`);
})