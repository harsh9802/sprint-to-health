import dotenv from "dotenv";
import axios from "axios";

dotenv.config({ path: "./config.env" }); // Load environment variables

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_ENDPOINT = process.env.OPENAI_API_ENDPOINT

const url = OPENAI_API_ENDPOINT;
const headers = {
	'Content-Type': 'application/json',
	'Authorization': `Bearer ${OPENAI_API_KEY}`,
};
const model_name = 'gpt-4o-mini';  // Or 'gpt-4' if availablE

export const fetchChatGPTResponse = async (req, res) => {

	req.body.role = "user",
	req.body.type = "text",
	req.body.content = req.body.question
	createInteraction(req, res);

    const body = JSON.stringify({
      model: model_name,
      messages: [{ role: 'user', content: req.body.question }],
    });
   
    const response = await fetch(url, { method: 'POST', headers, body });
    const data = await response.json();
    console.log(data)
	
	req.body.role = "assistant",
	req.body.type = "text",
	req.body.content = data.choices[0].message.content
	createInteraction(req, res);

    return res.status(200).json({
        response: data.choices[0].message.content
    });
};

export const getSummaryFromDashboard = async (req, res) => {
	// var dashboardImage = fs.readFileSync("design.png", { encoding: "base64" });

	// Bad Smell: 1. Resolved by removing extra logic
	var dashboardImage = req.body.dashboardImage;
	req.body.role = "user",
	req.body.type = "image",
	req.body.content = dashboardImage
	createInteraction(req, res);
	

	const body = JSON.stringify({
		model: model_name,
		messages: [
			{
				// Bad Smell: 2. Resolved by storing the long text into constant in util
				role: "user", content: [{
					type: "text", 
					text: "Attached image is a screenshot of the dashboard of vitals for a given user. \
							Your task is to generate a text summary in a specific format only which will be used as a transcript to dictate to the user (might be blind).\
							Give response in strictly given format JSON: {\"transcript\": \"Thank you for asking about your health summary. <your response based on the dashboard>\"}\
							When forming a dashboard summary, make sure to include specific numbers and not just generalised information."
				}]
			},
			{
				role: "user",
				// Bad Smell: 1. resolved by removing redundant code
				content: [{ type: "image_url", image_url: { url: dashboardImage, detail: "low" } }]
			}
		],
	});

	// 3. Variabl names refactored to more intuitive ones
	const gptResponse = await fetch(url, { method: 'POST', headers, body });
	const gptResponseJson = await gptResponse.json();
	console.log(gptResponseJson)
	console.log(gptResponseJson.choices[0].message.content);
	
	req.body.role = "assistant",
	req.body.type = "text",
	req.body.content = gptResponseJson.choices[0].message.content
	createInteraction(req, res);

	return res.status(200).json({
		response: gptResponseJson.choices[0].message.content
	});
};

export const fetchResponse = async (req, res) => {
	// var dashboardImage = fs.readFileSync("design.png", { encoding: "base64" });
    console.log("route called .....  : ",req.body);
	let userResponse = req.body.userResponse;
	let assistantQueston = req.body.assistantQueston;

	console.log("process : ",process.env.OPENAI_API_KEY);

	const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    };
    const body = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userResponse }],
    });
	//making query to the chatgpt
	const resp = await axios.post('https://api.openai.com/v1/chat/completions',body,{headers});
    
	//store question answer to the database
    console.log("response : ",resp);

    return res.status(200).json({
		response: resp.data.choices[0].message.content
	});
};
