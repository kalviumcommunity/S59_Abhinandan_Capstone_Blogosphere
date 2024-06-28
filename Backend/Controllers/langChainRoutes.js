const { ChatGoogleGenerativeAI } = require('@langchain/google-genai')
const { HumanMessage } = require('@langchain/core/messages')
const express = require("express");
const router = express.Router();
require('dotenv').config();
const GenAImodel = new ChatGoogleGenerativeAI({
    modelName: 'gemini-pro',
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function googleGenAi(ques) {
    let response = "";
    try {
      const message = new HumanMessage({ content: [{ type: 'text', text: ques }] });
      const res = await GenAImodel.invoke([message]);
      response = res.text;
    } 
    
    catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
    return response;
}


router.post('/genAI', async (req, res) => { 
    try{
        const { question } =  req.body;
        console.log(req.body)

        if(!question) {
            return res.status(400).json({ error : "Invalid or missing question in the request body."})
        }

        const response = await googleGenAi(question);
        res.json({ response });
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            res.status(400).json({ error: 'Invalid JSON in request body' });
        } 
        if (res.status == 400) {
            console.log("this")
        }
        else if (error.name === 'ValidationError') {
            res.status(422).json({ error: error.message });
        } 
        else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
})

module.exports = router