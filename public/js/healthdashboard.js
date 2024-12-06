let glucoseData = [];
let bloodPressureData1 = [];
let bloodPressureData2 = [];
let oxygenSaturationData = [];

export const fetchVitals = async function (userId, chart3, chart3Unit) {
  try {
    const fetchResponse = await fetch("/api/v1/vitalRecords/getLatestVitals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        vital_names: [
          "Blood Sugar Level",
          "Systolic Blood Pressure (Upper)",
          "Diastolic Blood Pressure (Lower)",
          chart3,
        ],
      }),
    });

    const response = await fetchResponse.json();
    const data = response.data;

    if (Object.keys(data).length === 0) {
      console.error("API did not return vital data.");
      return;
    } else {
      glucoseData = data["Blood Sugar Level"] || [];
      bloodPressureData1 = data["Systolic Blood Pressure (Upper)"] || [];
      bloodPressureData2 = data["Diastolic Blood Pressure (Lower)"] || [];
      oxygenSaturationData = data[chart3] || [];

      // Call displayCharts after fetching data for the selected vital
      displayCharts(chart3, chart3Unit);
    }
  } catch (error) {
    console.error("Error fetching vital records:", error);
  }
};

const startRecordButton = document.getElementById("askQuestions");
const transcriptContainer = document.getElementById("transcript-container");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  alert("Speech recognition is not supported in this browser.");
}
export const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const questions = [
  "Do you feel more tired or less energetic than usual?",
  "Have you noticed any changes in your sleep patterns?",
  "Do you experience difficulty concentrating?",
  "Have you lost interest in activities that used to bring you joy?",
  "How has your mood been over the past few weeks?",
  "Do you often feel sad or hopeless?",
  "Have you experienced changes in your appetite or weight recently?",
  "Do you feel guilty or blame yourself for things?",
  "Have you had thoughts of hurting yourself or ending your life?",
  "Do you feel anxious or worried more than usual?",
  "Do you have tremors or not?",
  "Do you often feel on edge or easily startled?",
  "Have you noticed any physical symptoms of anxiety, like a racing heart or shortness of breath?",
  "Do you avoid certain situations because of fear or worry?",
  "Have you ever felt that people are plotting against you?",
  "Do you hear or see things that others don't?",
  "Do you ever feel that your thoughts are being controlled by outside forces?",
  "Do you have trouble remembering recent events or conversations?",
  "Have you noticed difficulty with tasks like managing your finances or following directions?",
  "Do you get confused about time, such as the day of the week or time of day?",
  "Do you ever forget where you are or how you got there?",
  "Have you recently felt disoriented or confused about your surroundings?",
  "Have you had any sudden changes in your awareness or ability to focus?",
  "Have you experienced any hallucinations or vivid dreams lately?",
  "How often do you drink alcohol, and do you feel it affects your health or well-being?",
  "Have you used any recreational drugs or medications in ways not prescribed?",
  "Have you had trouble controlling your use of substances, such as needing to take more to feel the same effect?",
  "Have you ever felt that life is not worth living?",
  "Do you have any plans or thoughts about ending your life?",
  "Have you withdrawn from social activities or friends because of how youve been feeling?",
];

let answeredQuestions = [];
let askedQuestions = [];
let questionCount = 0;
const maxQuestionsPerDay = 5;
let userWantsToStop = false;
let recentAskQuestion;

// Global variables to store chart instances
let glucoseChart, bloodPressureChart, oxygenSaturationChart;

function displayCharts(chart3, chart3Unit) {
  // Get canvas contexts
  let glucoseCtx = document.getElementById("glucoseCanvas").getContext("2d");
  let bloodPressureCtx = document
    .getElementById("bloodPressureCanvas")
    .getContext("2d");
  let oxygenSaturationCtx = document
    .getElementById("oxygenSaturationCanvas")
    .getContext("2d");

  const labels = Array.from({ length: 15 }, (_, i) => i + 1);
  const chart3_heading = document.querySelector(".chart3_heading");
  chart3_heading.textContent = `${chart3} Chart`;

  // Destroy existing charts if they exist
  if (glucoseChart) glucoseChart.destroy();
  if (bloodPressureChart) bloodPressureChart.destroy();
  if (oxygenSaturationChart) oxygenSaturationChart.destroy();

  // Create glucose chart
  glucoseChart = new Chart(glucoseCtx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Blood Glucose (mg/dL)",
          data: glucoseData.slice(0, 15),
          borderColor: "rgba(54, 162, 235, 1)",
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
    },
  });

  // Create blood pressure chart
  bloodPressureChart = new Chart(bloodPressureCtx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Systolic Blood Pressure (mmHg)",
          data: bloodPressureData1.slice(0, 15),
          borderColor: "red",
          fill: false,
        },
        {
          label: "Diastolic Blood Pressure (mmHg)",
          data: bloodPressureData2.slice(0, 15),
          borderColor: "blue",
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
    },
  });

  // Create dynamic chart for the selected vital
  oxygenSaturationChart = new Chart(oxygenSaturationCtx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `${chart3} (${chart3Unit})`,
          data: oxygenSaturationData.slice(0, 15),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

export const summarizeDashboard = async (userId) => {
  try {
    // Fetch all the vitals data
    const fetchVitalsData = async (vitalNames) => {
      const response = await fetch("/api/v1/vitalRecords/getLatestVitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          vital_names: vitalNames,
        }),
      });

      const result = await response.json();
      return result.data;
    };

    // Fetch required data
    const vitalsData = await fetchVitalsData([
      "Blood Sugar Level",
      "Systolic Blood Pressure (Upper)",
      "Diastolic Blood Pressure (Lower)",
      "Oxygen Saturation",
    ]);

    // Extract specific data for voice assistant
    const glucoseData = vitalsData["Blood Sugar Level"] || [];
    const bloodPressureData1 =
      vitalsData["Systolic Blood Pressure (Upper)"] || [];
    const bloodPressureData2 =
      vitalsData["Diastolic Blood Pressure (Lower)"] || [];
    const oxygenSaturationData = vitalsData["Oxygen Saturation"] || [];

    const dashboardData = {
      glucoseData,
      bloodPressureData1,
      bloodPressureData2,
      oxygenSaturationData,
    };

    // Send the dashboard data to the server for summarization
    const response = await fetch("/api/v1/llm/summarizeDashboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dashboardData),
    });

    // Process the summary and extract transcript
    const result = await response.json();
    let summaryJson = result.response.replace("```json", "");
    summaryJson = summaryJson.replace("```", "");
    const transcript = JSON.parse(summaryJson).transcript;

    // Speak the transcript
    speak(transcript);
  } catch (error) {
    console.error("Error summarizing dashboard:", error);
    alert("Failed to summarize the dashboard. Please try again.");
  }
};

document.getElementById("askQuestions").addEventListener("click", () => {
  askQuestion();
});

function askQuestion() {
  if (userWantsToStop || questionCount >= maxQuestionsPerDay) {
    const message = userWantsToStop
      ? "Thank you for your responses. You can let me know if you want to continue later."
      : "You have answered the maximum number of questions for today.";
    //transcriptContainer.innerHTML += `<p>Assistant: ${message}</p>`;
    speak(message);
    return;
  }

  const remainingQuestions = questions.filter(
    (q) => !answeredQuestions.includes(q)
  );

  if (remainingQuestions.length > 0) {
    const question =
      remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
    askedQuestions.push(question);

    // Display the question in the transcript container
    // transcriptContainer.innerHTML += `<p>Assistant asks: ${question}</p>`;

    recentAskQuestion = question;
    speak(question);
    questionCount++;
  } else {
    const message = "You have answered all the questions for today.";
    // transcriptContainer.innerHTML += `<p>Assistant: ${message}</p>`;
    speak(message);
  }
}

async function fetchChatGPTResponse(transcript) {
  const url = "http://localhost:3000/api/v1/llm/askQuestions";
  let body = {
    userResponse: transcript,
    assistantQuestion: recentAskQuestion,
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  return data.response;
}

startRecordButton.addEventListener("click", () => {
  recognition.start();
});

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript.toLowerCase();
  // transcriptContainer.innerHTML += `<p>You: ${transcript}</p>`;

  if (transcript.includes("i don't want to answer any further questions")) {
    userWantsToStop = true;
    const message =
      "Alright, I will stop asking questions. Let me know if you need anything else.";
    // transcriptContainer.innerHTML += `<p>Assistant: ${message}</p>`;
    speak(message);
    return;
  }

  if (answeredQuestions.includes(transcript)) {
    // transcriptContainer.innerHTML += `<p>Assistant: You've already answered that question.</p>`;
  } else {
    answeredQuestions.push(transcript);
    const chatGPTResponse = await fetchChatGPTResponse(transcript);
    // transcriptContainer.innerHTML += `<p>Assistant: ${chatGPTResponse}</p>`;
    speak(chatGPTResponse);
  }

  askQuestion();
};

recognition.onerror = (event) => {
  console.error("Speech recognition error:", event.error);
  alert("Error with speech recognition. Please try again.");
};

// Start asking questions on page load
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

const dashboardContainer = document.querySelector(
  ".health-dashboard-container"
);

// Healthd Dashboard Clien-side Handler
if (dashboardContainer) {
  const userId = document.getElementById("userId").value;
  const explainWithVoiceButton = document.getElementById("getSummary");

  const addVitalBtn = document.getElementById("addVitalBtn");
  const addVitalForm = document.getElementById("addVitalForm");
  const vitalNameSelect = document.getElementById("vitalName");
  const vitalUnitSpan = document.getElementById("vitalUnit");
  const vitalChartSelect = document.getElementById("vitalChartSelect");

  // Fetch vital names and units from the server
  const fetchVitalNames = async () => {
    try {
      const response = await fetch("/api/v1/vitals/");
      if (!response.ok) throw new Error("Failed to fetch vitals data.");
      const vitals = await response.json();

      vitals.data.data.forEach((vital) => {
        const option = document.createElement("option");
        option.value = vital.name;
        option.textContent = vital.name;
        option.dataset.unit = vital.unit;
        vitalNameSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching vital names:", error);
    }
  };

  // Fetch vital names and units from the server
  const fetchVitalCharts = async () => {
    try {
      const response = await fetch("/api/v1/vitals/");
      if (!response.ok) throw new Error("Failed to fetch vitals data.");
      const vitals = await response.json();

      vitals.data.data.forEach((vital) => {
        const option = document.createElement("option");
        option.value = vital.name;
        option.textContent = vital.name;
        option.dataset.unit = vital.unit;
        vitalChartSelect.appendChild(option);
        vitalChartSelect.value = "Select Another Vital to Render Graph";
      });
    } catch (error) {
      console.error("Error fetching vital charts:", error);
    }
  };

  // Show/Hide the form
  addVitalBtn.addEventListener("click", () => {
    addVitalForm.classList.toggle("hidden");

    if (!addVitalForm.classList.contains("hidden")) {
      // Scroll to the form
      addVitalForm.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  // Update unit dynamically based on selected vital
  vitalNameSelect.addEventListener("change", (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    vitalUnitSpan.textContent = selectedOption.dataset.unit || "-";
  });

  vitalChartSelect.addEventListener("change", (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedVital = selectedOption.value;
    const selectedUnit = selectedOption.dataset.unit;

    fetchVitals(userId, selectedVital, selectedUnit);
  });

  // Handle form submission
  const vitalForm = document.getElementById("vitalForm");
  vitalForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const vitalName = vitalNameSelect.value;
    const vitalValue = document.getElementById("vitalValue").value;
    const unit = vitalUnitSpan.textContent;

    try {
      const response = await fetch("/api/v1/vitalRecords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ vital: vitalName, value: vitalValue }]),
      });

      if (response.ok) {
        alert(`${vitalName} added successfully!`);
        vitalForm.reset();
        addVitalForm.classList.add("hidden");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error adding vital:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  });
  fetchVitalNames();
  fetchVitalCharts();
  fetchVitals(userId, "Oxygen Saturation", "%");

  explainWithVoiceButton.addEventListener("click", (event) => {
    summarizeDashboard(userId);
  });
}
