import dotenv from "dotenv";
import axios from "axios";

dotenv.config({ path: "./config.env" });
const model_name = "gpt-4o-mini";

export const fetchChatGPTResponse = async (req, res) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const url = process.env.OPENAI_API_ENDPOINT;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };

  const body = JSON.stringify({
    model: model_name,
    messages: [{ role: "user", content: req.body.question }],
  });

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
  });
  const data = await response.json();
  console.log(data);

  return res.status(200).json({
    response: data.choices[0].message.content,
  });
};

export const getSummaryFromDashboardOG = async (req, res) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const url = process.env.OPENAI_API_ENDPOINT;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };

  var dashboardImage = req.body.dashboardImage;

  const body = JSON.stringify({
    model: model_name,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: 'Attached image is a screenshot of the dashboard of vitals for a given user. \
					Your task is to generate a text summary in a specific format only which will be used as a transcript to dictate to the user (might be blind).\
					Give response in strictly given format JSON: {"transcript": "Thank you for asking about your health summary. <your response based on the dashboard>"}\
					When forming a dashboard summary, make sure to include specific numbers and not just generalised information.',
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: dashboardImage,
              detail: "low",
            },
          },
        ],
      },
    ],
  });

  const response = await fetch(url, { method: "POST", headers, body });
  const data = await response.json();
  console.log(data);
  console.log(data.choices[0].message.content);
  // return data.choices[0].message.content;
  return res.status(200).json({
    response: data.choices[0].message.content,
  });
};

export const getSummaryFromDashboard = async (req, res) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const url = process.env.OPENAI_API_ENDPOINT;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };

  const {
    glucoseData,
    bloodPressureData1,
    bloodPressureData2,
    oxygenSaturationData,
  } = req.body;

  // Prepare the body for OpenAI API with the vital data
  const body = JSON.stringify({
    model: "gpt-3.5-turbo", // Or whichever model you're using
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that provides health summaries based on user data.",
      },
      {
        role: "user",
        content: `Here is the user's health data for the past few days. Please provide a summary of their health status.

        Glucose Data (Blood Sugar Level): ${glucoseData.join(", ")}
        Systolic Blood Pressure (Upper): ${bloodPressureData1.join(", ")}
        Diastolic Blood Pressure (Lower): ${bloodPressureData2.join(", ")}
        Oxygen Saturation: ${oxygenSaturationData.join(", ")}
        
        Provide a summary in the following format: 
        {"transcript": "Thank you for asking about your health summary. <your response based on the dashboard>"}
        Please use specific numbers and avoid generalizations.`,
      },
    ],
  });

  try {
    // Send the data to OpenAI API
    const response = await fetch(url, { method: "POST", headers, body });
    const data = await response.json();

    // Check for a valid response from OpenAI API
    if (data && data.choices && data.choices[0].message) {
      const summary = data.choices[0].message.content;
      console.log("Generated Summary:", summary);
      return res.status(200).json({
        response: summary,
      });
    } else {
      return res.status(500).json({ error: "Failed to generate summary" });
    }
  } catch (error) {
    console.error("Error fetching from OpenAI API:", error);
    return res
      .status(500)
      .json({ error: "Failed to get response from OpenAI" });
  }
};

export const fetchResponse = async (req, res) => {
  // var dashboardImage = fs.readFileSync("design.png", { encoding: "base64" });

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const url = process.env.OPENAI_API_ENDPOINT;

  console.log("route called .....  : ", req.body);
  let userResponse = req.body.userResponse;
  let assistantQueston = req.body.assistantQueston;

  console.log("process : ", process.env.OPENAI_API_KEY);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };
  const body = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: userResponse }],
  });
  //making query to the chatgpt
  const resp = await axios.post(url, body, { headers });

  //store question answer to the database
  console.log("response : ", resp);

  return res.status(200).json({
    response: resp.data.choices[0].message.content,
  });
};
