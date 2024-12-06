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
  // transcriptContainer.innerHTML = `<p>You: ${transcript}</p>`;

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
  // transcriptContainer.innerHTML += `<p>Assistant: ${result.response}</p>`;

  // Speak the response
  speak(result.response);

  // Send the user's command and the assistant's response to the backend to store in the database
  const interactionResponse = await fetch("/api/v1/interactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      command: transcript, // User's command
      response: result.response, // Assistant's response
    }),
  });

  // Fetch latest interactions
  try {
    const response = await fetch("/api/v1/interactions/latest", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    const interactions = data.data; // Assuming data contains the interactions in an array

    // Update the transcript container with the latest interactions
    transcriptContainer.innerHTML = ""; // Clear previous interactions

    interactions.forEach((interaction) => {
      transcriptContainer.innerHTML += `
        <div class="interaction">
          <p><strong>Command:</strong> ${interaction.command}</p>
          <p><strong>Response:</strong> ${interaction.response}</p>
          <p><small>Timestamp: ${new Date(
            interaction.timestamp
          ).toLocaleString()}</small></p>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error fetching interactions:", error);
  }
};

recognition.onerror = (event) => {
  console.error("Speech recognition error:", event.error);
  alert("Error with speech recognition. Please try again.");
};
