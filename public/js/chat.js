const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')

socket.on("message", (message) => {
  console.log(message);
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute('disabled','disabled')
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (message) => {
      $messageFormButton.removeAttribute('disabled')
      $messageFormInput.value = ""
      $messageFormInput.focus()
    console.log("The message was delivered",message)
  });
});

document.querySelector("#send-location").addEventListener("click", (e) => {
    e.preventDefault();
    $sendLocationButton.setAttribute('disabled','disabled')
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("sendLocation", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    },(message)=>{
        $sendLocationButton.removeAttribute('disabled')
        console.log(message)
    });
  });
});
