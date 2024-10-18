import dotenv from "dotenv";
dotenv.config({ path: "./config.env" }); // Load environment variables

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export const fetchChatGPTResponse = async (req, res) => {
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    };
    const body = JSON.stringify({
      model: 'gpt-3.5-turbo',  // Or 'gpt-4' if available
      messages: [{ role: 'user', content: req.body.question }],
    });
   
    const response = await fetch(url, { method: 'POST', headers, body });
    const data = await response.json();
    console.log(data)
    // return data.choices[0].message.content;
    return res.status(200).json({
        response: data.choices[0].message.content
    });
};