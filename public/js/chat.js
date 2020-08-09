const socket=io()


//elements
const $form=document.querySelector('#form-msg')
const $formInput=$form.querySelector('input')
const $formSubmit=$form.querySelector('button')
const $map=document.querySelector('#sendLocation')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate= document.querySelector('#message-template').innerHTML
const mapurlTemplate=document.querySelector('#mapurl-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML
//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}


console.log("hello")
socket.on('message',(msg)=>{
  console.log(msg)
  const html =Mustache.render(messageTemplate,{
    username:msg.username,
    message:msg.text,
    createdAt:moment(msg.createdAt).format('h:mm')
  })
  $messages.insertAdjacentHTML('beforeend',html)
  autoscroll()
})

socket.on('locationMessage',(url)=>{
  console.log(url)
  const html =Mustache.render(mapurlTemplate,{
    url:url.url,
    username:url.username,
    createdAt:moment(url.createdAt).format('h:mm')
  })
  $messages.insertAdjacentHTML('beforeend',html)
  autoscroll()
})

socket.on('userlist',({room,users})=>{
  const html =Mustache.render(sidebarTemplate,{
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML=html
})
$form.addEventListener('submit',(e)=>{
  e.preventDefault()
//disabling button
$form.setAttribute('disabled','disabled')

  const msg=e.target.elements.message.value
  socket.emit('sendMessage',msg,(deliverstatus)=>{
    //enabling the form
      $form.removeAttribute('disabled')
      $formInput.value=''
      $formInput.focus()
        console.log(deliverstatus)
  })
})
$map.addEventListener('click',(e)=>{
  e.preventDefault()
  //disabling map button
  $map.setAttribute('disabled','disabled')
  if(!navigator.geolocation){
    return alert('Geolocation is not supported by your browser.')
  }
  navigator.geolocation.getCurrentPosition((position)=>{
    socket.emit('sendLocation',{long:position.coords.longitude,lat:position.coords.latitude},(locationStatus)=>{
//enabling map button
$map.removeAttribute('disabled')
      console.log(locationStatus)
    })
//    console.log(position)
  })
})
socket.emit('join',{username,room},(error)=>{
  if(error){
    alert(error)
    location.href='/'
  }
})
