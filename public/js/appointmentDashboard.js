const appointmentDashboard = document.getElementById("appointment-dashboard");

if (appointmentDashboard) {
  const toggleFormButton = document.getElementById("toggleFormButton");
  const appointmentForm = document.getElementById("appointment-form");

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
}
