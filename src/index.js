const http=require('http')
const path=require('path')
const express=require('express')
const socketio=require('socket.io')
const {generateMessage,generateLocation}=require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')

const app=express()
const server =http.createServer(app);
const io=socketio(server)


const publicDirectoryPath=path.join(__dirname,'../public')
const port =process.env.PORT || 3000

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
  console.log('new websocket connection')

  socket.on('join',(options,callback)=>{
    const{error,user}=addUser({id:socket.id, ...options})

  if(error){
    return callback(error)
  }
    socket.join(user.room)
    socket.emit('message',generateMessage("Admin",'Welcome'))
    socket.broadcast.to(user.room).emit('message',generateMessage(user.username,`${user.username} has joined!`))
    io.to(user.room).emit('userlist',{
      room:user.room,
      users:getUsersInRoom(user.room)
    })
    callback()
  })

  socket.on('sendMessage',(msg,callback)=>{
    const user=getUser(socket.id)

    io.to(user.room).emit('message',generateMessage(user.username,msg))
    callback('delivered')
  })
  socket.on('disconnect',()=>{
    const user=removeUser(socket.id)
    if(user){

    io.to(user.room).emit('message',generateMessage("Admin",`${user.username} has left!`))

    io.to(user.room).emit('userlist',{
      room:user.room,
      users:getUsersInRoom(user.room)
    })
  }
  })
  socket.on('sendLocation',({long,lat},callback)=>{
      const user=getUser(socket.id)
    io.to(user.room).emit('locationMessage',generateLocation(user.username,`https://google.com/maps?q=${lat},${long}`))
    callback('location sent')
  })
})

server.listen(port,()=>{
  console.log(`server is up and running on ${port}`)
})
