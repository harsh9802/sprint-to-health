const appointmentDashboard = document.getElementById("appointment-dashboard");

if (appointmentDashboard) {
  const toggleFormButton = document.getElementById("toggleFormButton");
  const appointmentForm = document.getElementById("appointment-form");
  const voiceButton = document.getElementById("voiceButton");
  const stopVoiceButton = document.getElementById("stop-voice-btn");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser.");
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  // Function to speak text
  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  appointmentForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    try {
      const response = await fetch("/api/v1/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        alert("Appointment successfully added!");
        this.reset();
        location.reload();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to add appointment."}`);
      }
    } catch (error) {
      console.error("Error adding appointment:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  });

  toggleFormButton.addEventListener("click", () => {
    appointmentForm.classList.toggle("hidden"); // Toggle the hidden class
    if (!appointmentForm.classList.contains("hidden")) {
      toggleFormButton.textContent = "Hide Appointment Form"; // Change button text
      appointmentForm.scrollIntoView({ behavior: "smooth" }); // Scroll to form
    } else {
      toggleFormButton.textContent = "Add New Appointment"; // Reset button text
    }
  });

  const fetchUpcomingAppointments = async (duration = 7) => {
    try {
      // Use query parameters to pass duration
      const response = await fetch(
        `http://localhost:3000/api/v1/appointment/myAppointments?duration=${duration}`, // Use query parameter for duration
        {
          method: "GET", // GET request without a body
          headers: {
            "Content-Type": "application/json",
            // Include any authorization headers if necessary, e.g.:
            // Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch upcoming appointments");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      alert(error.message); // Handle the error appropriately
    }
  };

  const getUpcomingAppointments = async (upcomingAppointments) => {
    const response = await fetch("/api/v1/llm/getUpcomingAppointmentsSummary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointments: upcomingAppointments, // Pass the upcoming appointments here
      }),
    });

    const data = await response.json();
    const assistantResponse = data.response.transcript || data.response; // Adjust if "transcript" is the key
    speak(assistantResponse);
    // // Display the assistant's response
    // transcriptContainer.innerHTML += `<p>Assistant: ${data.response}</p>`;
    // speak(data.response); // Use the speak function to vocalize the response
  };

  // Example of how to call this function in your onresult handler:
  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    console.log(transcript);
    // transcriptContainer.innerHTML = `<p>You: ${transcript}</p>`;

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
    console.log("result", result.response);
    transcriptContainer.innerHTML += `<p>Assistant: ${result.response}</p>`;
    speak(result.response);

    // Call the upcoming appointments summary after getting a relevant question
    if (transcript.toLowerCase().includes("upcoming appointments")) {
      await getUpcomingAppointments();
    }
  };

  voiceButton.addEventListener("click", async (event) => {
    let appointments = await fetchUpcomingAppointments(); // Use await here to wait for the data
    await getUpcomingAppointments(appointments);
  });

  stopVoiceButton.addEventListener("click", () => {
    window.speechSynthesis.cancel();
  });
}
