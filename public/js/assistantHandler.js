const startRecordButton = document.getElementById("start-record-btn");
const stopVoiceButton = document.getElementById("stop-voice-btn");
const transcriptContainer = document.getElementById("transcript-container");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Function to speak text
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

// Function to stop speech synthesis
function stopSpeaking() {
  window.speechSynthesis.cancel();
}

startRecordButton.addEventListener("click", () => {
  recognition.start();
});

stopVoiceButton.addEventListener("click", () => {
  stopSpeaking(); // Stop any ongoing speech
});

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  transcriptContainer.innerHTML = `<p>You: ${transcript}</p>`;

  // Fetch response from server
  const response = await fetch("/api/v1/llm/callChat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: transcript,
    }),
  });

  const result = await response.json();
  transcriptContainer.innerHTML += `<p>Assistant: ${result.response}</p>`;

  // Speak the response
  speak(result.response);
};

recognition.onerror = (event) => {
  console.error("Speech recognition error:", event.error);
  alert("Error with speech recognition. Please try again.");
};
