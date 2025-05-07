const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

async function geminiAI({ prompt }) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    return response.text; 
  } catch (error) {
    console.error("Error in geminiAI:", error);
    throw new Error("Failed to generate AI response");
  }
}

module.exports = {
  geminiAI,
};



//  =============
// const express = require("express");
// const app = express();
// const port = 3000;
// const { GoogleGenAI } = require("@google/genai");
// const { geminiAI } = require("./helpers/gemini");
// const {createServer} = require("http");


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.server  = createServer(app); 



// app.get("/", async (req, res) => {
//   const { prompt } = req.query;
//   const geminiresponse = await Promise.all([geminiAI({ prompt })]);
//   res.send(geminiresponse);
// });

// app.get("/hello", async (req, res) => {
//   // const { prompt } = req.query;
//   // const geminiresponse = await Promise.all([geminiAI({ prompt })]);
//   res.send("geminiresponse");
// });





// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
});
