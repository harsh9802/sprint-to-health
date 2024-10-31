import dotenv from "dotenv";
// import fs from "fs";
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

    const body = JSON.stringify({
      model: model_name,
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

export const getSummaryFromDashboard = async (req, res) => {
	// var dashboardImage = fs.readFileSync("design.png", { encoding: "base64" });

	var dashboardImage = req.body;

	const body = JSON.stringify({
		model: model_name,
		messages: [
			{
				role: "user", content: [{
					type: "text", 
					text: "Attached image is a screenshot of the dashboard of vitals for a given user. \
					Your task is to generate a text summary in a specific format only which will be used as a transcript to dictate to the user.\
					Give response in strictly given format JSON: {'transcript': 'Thank you for asking about your health summary. <your response based on the dashboard>'}"
				}]
			},
			{
				role: "user",
				content: [{ type: "image_url", image_url: { url: `data:image/jpeg;base64,${dashboardImage}`, detail: "low" } }]
			}
		],
	});

	const response = await fetch(url, { method: 'POST', headers, body });
	const data = await response.json();
	console.log(data)
	console.log(data.choices[0].message.content);
	// return data.choices[0].message.content;
	return res.status(200).json({
		response: data.choices[0].message.content
	});
};
