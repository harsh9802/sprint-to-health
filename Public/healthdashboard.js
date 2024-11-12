var glucoseData = [];
var bloodPressureData1 = [];
var bloodPressureData2 = [];

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
    var data = response.data;

    glucoseData = data["Blood Sugar Level"];
    bloodPressureData1 = data["Systolic Blood Pressure (Upper)"];
    bloodPressureData2 = data["Diastolic Blood Pressure (Lower)"];
    displayCharts();
}));

const glucoseCtx = document.getElementById('glucoseCanvas').getContext('2d');
const bloodPressureCtx = document.getElementById('bloodPressureCanvas').getContext('2d');
const activityCtx = document.getElementById('activityCanvas').getContext('2d');

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
    // Add additional questions as needed
];

let answeredQuestions = [];
let askedQuestions=[];
let questionCount = 0;
const maxQuestionsPerDay = 5;
let userWantsToStop = false;
let recentAskQuestion;
let selectedVoice = null;

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
async function fetchChatGPTResponse(transcript) {
    const url = 'http://localhost:3000/api/v1/llm/askQuestions';
    let body = {
        userResponse: transcript,
        assistantQuestion: recentAskQuestion
    };

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log("datatata : ", data); // Debugging output to log the response data

    return data.response;
}
// Initialize SpeechRecognition


// Populate voice dropdown and set selectedVoice based on selection
function listAvailableVoices() {
    return new Promise((resolve) => {
        const synth = window.speechSynthesis;
        synth.onvoiceschanged = () => {
            const voices = synth.getVoices();
            const voiceDropdown = document.getElementById("voiceDropdown");

            voiceDropdown.innerHTML = '<option value="">Select a voice</option>';
            const englishVoices = voices.filter(voice => voice.lang.startsWith("en"));
            englishVoices.forEach((voice, index) => {
                const option = document.createElement("option");
                option.value = index;
                option.textContent = voice.name;
                voiceDropdown.appendChild(option);
            });

            selectedVoice = englishVoices[0] || voices[0];
            if (selectedVoice) console.log(`Using default voice: ${selectedVoice.name}`);
            
            resolve(englishVoices);
        };
    });
}

// Populate voices on page load
listAvailableVoices();

// Update selected voice based on dropdown choice
document.getElementById("voiceDropdown").addEventListener("change", (event) => {
    const voices = window.speechSynthesis.getVoices();
    const voiceIndex = event.target.value;
    selectedVoice = voices[voiceIndex];
    console.log(`Selected voice: ${selectedVoice.name}`);
});

// Function to start the interaction
document.getElementById("askQuestions").addEventListener("click", () => {
    if (selectedVoice) {
        console.log(`Starting interaction with selected voice: ${selectedVoice.name}`);
        askQuestion(); // Start asking the first question
    } else {
        alert("Please select a voice from the dropdown to start the interaction.");
    }
});

// Function to ask questions using selected voice
function askQuestion() {
    if (userWantsToStop || questionCount >= maxQuestionsPerDay) {
        const message = userWantsToStop
            ? "Thank you for your responses. You can let me know if you want to continue later."
            : "You have answered the maximum number of questions for today.";
        speak(message);
        return;
    }

    const remainingQuestions = questions.filter(q => !answeredQuestions.includes(q));
    
    if (remainingQuestions.length > 0) {
        const question = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
        askedQuestions.push(question);
        recentAskQuestion = question;

        // Speak the question and start listening for the answer
        speak(question);
        recognition.start(); // Start listening after the question is asked
        questionCount++;
    } else {
        speak("You have answered all the questions for today.");
    }
}

// Speak function to use the selected voice
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
}

// Function to fetch response from ChatGPT API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
} else {
    // const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    // const recognition = new SpeechRecognition();
    // recognition.lang = 'en-US';
    // recognition.interimResults = false;
    // recognition.maxAlternatives = 1;

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        alert(`Speech recognition error: ${event.error}. Please check your microphone and try again.`);
    };

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log(`Transcript: ${transcript}`); 
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
    };
}