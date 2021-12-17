const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $locations = document.querySelector('#locations')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

socket.on("message", (message) => {
  console.log(message)
  const html = Mustache.render(messageTemplate,{
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend',html)
});

socket.on("locationMessage",(message)=>{
  console.log(message)
  const html = Mustache.render(locationTemplate,{
    username:message.username,
    url:message.url,
    createdAt: moment(message.createdAt).format('h:mm a')
    
  })
  $messages.insertAdjacentHTML('beforeend',html)
})

socket.on("roomData",({room,users})=>{
  const html = Mustache.render(sidebarTemplate,{
    room,
    users
  })
  document.querySelector("#sidebar").innerHTML = html
})

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

socket.emit('join',{username,room},(error)=>{
  if(error) {
    alert(error)
    location.href = '/'
  }
})