let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
  arrow[i].addEventListener("click", (e)=>{
 let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
 arrowParent.classList.toggle("showMenu");
  });
}
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bx-menu");
console.log(sidebarBtn);
sidebarBtn.addEventListener("click", ()=>{
  sidebar.classList.toggle("close");
});

 // Fetch appointments from the API route
 fetch('../api/v1/appointments/appointment')  // Correct route for fetching appointments
 .then(response => response.json())
 .then(data => {
   console.log(data);
     const tableBody = document.querySelector('#appointments-table tbody');

     if (data.length === 0) {
         tableBody.innerHTML = '<tr><td colspan="5">No appointments found</td></tr>';
     } else {
         // Loop through the appointments and add rows to the table
         data.forEach(appointment => {
             const row = document.createElement('tr');
             row.innerHTML = `
                 <td>${appointment.doctorName}</td>
                 <td>${new Date(appointment.appointmentDate).toLocaleString()}</td>
                 <td>${appointment.location}</td>
                 <td>${appointment.specialization}</td>
                 <td>${appointment.appointmentType}</td>
             `;
             tableBody.appendChild(row);
         });
     }
 })
 .catch(error => {
     console.error('Error fetching appointments:', error);
 });