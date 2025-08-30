/* Simplified form handler with success popup

*/

// Appointment form handler
function sendAppointment(event) {
  event.preventDefault(); // stop normal form submit

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const date = document.getElementById("date").value;
  const message = document.getElementById("message").value;

  // build mailto link
  const mailtoLink = `mailto:hello@wellspring.example?subject=Appointment Request&body=
  Name: ${name}%0D%0A
  Email: ${email}%0D%0A
  Phone: ${phone}%0D%0A
  Preferred Date: ${date}%0D%0A
  Message: ${message}`;

  // open default mail client
  window.location.href = mailtoLink;

  // show confirmation popup
  alert("Appointment request prepared. Please check your email client to send.");
}

// Contact form handler
function sendContact(event) {
  event.preventDefault(); // stop normal form submit

  const name = document.getElementById("c_name").value;
  const email = document.getElementById("c_email").value;
  const message = document.getElementById("c_message").value;

  // build mailto link
  const mailtoLink = `mailto:hello@wellspring.example?subject=Contact Form&body=
  Name: ${name}%0D%0A
  Email: ${email}%0D%0A
  Message: ${message}`;

  // open default mail client
  window.location.href = mailtoLink;

  // show confirmation popup
  alert("Thank you for contacting us! Please check your email client to send.");
}
