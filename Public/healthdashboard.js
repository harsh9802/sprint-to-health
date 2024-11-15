var glucoseData = []
var bloodPressureData1 = []
var bloodPressureData2 = []

fetch('/api/v1/dashboard/getLatestVitals', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        userId: "671e74cdc48e6c37bb62b10e",
        vital_names: ["Blood Sugar Level", "Systolic Blood Pressure (Upper)", "Diastolic Blood Pressure (Lower)"]
    })
}).then((fetchResponse) => fetchResponse.json().then((response) => {
    var data = response.data

    glucoseData = data["Blood Sugar Level"]
    bloodPressureData1 = data["Systolic Blood Pressure (Upper)"]
    bloodPressureData2 = data["Diastolic Blood Pressure (Lower)"]
    displayCharts()
}));


const glucoseCtx = document.getElementById('glucoseCanvas').getContext('2d');
const bloodPressureCtx = document.getElementById('bloodPressureCanvas').getContext('2d');
const activityCtx = document.getElementById('activityCanvas').getContext('2d');

const startRecordButton = document.getElementById('askQuestions');
const transcriptContainer = document.getElementById('transcript-container');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
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
    "Have you withdrawn from social activities or friends because of how youve been feeling?"
    ];
    
    let answeredQuestions = [];
    let askedQuestions = [];
    let questionCount = 0;
    const maxQuestionsPerDay = 5;
    let userWantsToStop = false;
    let recentAskQuestion;

function displayCharts() {
    new Chart(glucoseCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 18}, (_, i) => i + 1),
            datasets: [{
                label: 'Blood Glucose (mg/dL)',
                data: glucoseData,
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    new Chart(bloodPressureCtx, {
        type: 'line',
        data: {
            labels: ['1/1', '1/2', '1/3', '1/4'],
            datasets: [
                { label: 'Systolic (SBP)', data: bloodPressureData1, borderColor: 'red', fill: false },
                { label: 'Diastolic (DBP)', data: bloodPressureData2, borderColor: 'blue', fill: false }
            ]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    new Chart(activityCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                { label: 'Active Time (%)', data: [], backgroundColor: 'rgba(54, 162, 235, 0.6)' }
            ]
        },
        options: {
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });
}
    

document.getElementById("getSummary").addEventListener("click", async () => {
    screenshotTarget = document.body

    html2canvas(screenshotTarget).then(async (canvas) => {
        var base64image = canvas.toDataURL("image/png");
        const response = await fetch('/api/v1/llm/summarizeDashboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dashboardImage: base64image })
        });

        response.json().then((summary) => {
            console.log(summary.response)
            summaryJson = summary.response.replace("```json", "");
            summaryJson = summaryJson.replace("```", "");
            transcript = JSON.parse(summaryJson).transcript;
            console.log(transcript)
            speak(transcript)
        })
            


    });
   
    
});


document.getElementById("askQuestions").addEventListener("click", () =>{
    askQuestion();
}) 

function askQuestion() {
    if (userWantsToStop || questionCount >= maxQuestionsPerDay) {
        const message = userWantsToStop
            ? "Thank you for your responses. You can let me know if you want to continue later."
            : "You have answered the maximum number of questions for today.";
        //transcriptContainer.innerHTML += `<p>Assistant: ${message}</p>`;
        speak(message);
        return;
    }

    const remainingQuestions = questions.filter(q => !answeredQuestions.includes(q));
    
    if (remainingQuestions.length > 0) {
        const question = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
        askedQuestions.push(question);
<<<<<<< Updated upstream
        
        // Display the question in the transcript container
       // transcriptContainer.innerHTML += `<p>Assistant asks: ${question}</p>`;
        
=======
        console.log(question);
>>>>>>> Stashed changes
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
    const url = 'http://localhost:3000/api/v1/llm/askQuestions';
    let body = {
        userResponse: transcript,
        assistantQuestion: recentAskQuestion
    };

    const response = await fetch(url, { method: 'POST', body: JSON.stringify(body), headers: {
        'Content-Type': 'application/json'
      }});
    const data = await response.json();
    console.log("datatata : ",data);

    return data.response;
}

startRecordButton.addEventListener('click', () => {
    recognition.start();
});

recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    // transcriptContainer.innerHTML += `<p>You: ${transcript}</p>`;

    if (transcript.includes("i don't want to answer any further questions")) {
        userWantsToStop = true;
        const message = "Alright, I will stop asking questions. Let me know if you need anything else.";
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

    // askQuestion();
};

recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    alert('Error with speech recognition. Please try again.');
};

// Start asking questions on page load
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}
