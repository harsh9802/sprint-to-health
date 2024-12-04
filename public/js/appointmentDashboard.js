const appointmentDashboard = document.getElementById("appointment-dashboard");

if (appointmentDashboard) {
  document
    .querySelector("#appointment-form")
    .addEventListener("submit", async function (event) {
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
}
