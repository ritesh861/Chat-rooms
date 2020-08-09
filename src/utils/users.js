const users=[]

//add users
const addUser=({id,username,room})=>{
  //clean the data
  username=username.trim().toLowerCase()
  room=room.trim().toLowerCase()

//validate the data
  if(!username||!room)
  {
    return{
      error:'Username and rooms are required'
    }
  }

  //check for existing users
  const existingUser=users.find((user)=>{
    return user.room===room&&user.username===username
  })
  if(existingUser){
    return {
      error:'Username is in use!'
    }
  }

  //store users
  const user={id,username,room}
  users.push(user)
  return {user}
}

//removing user
const removeUser=(id)=>{
    const index=users.findIndex((user)=> user.id===id)
    if(index!==-1){
      return users.splice(index,1)[0]
    }

}

//get user
const getUser=(id)=>{
  const user=users.find((usr)=>usr.id===id)
  return user
}



//get users of a room
const getUsersInRoom=(room)=>{
  const arr=users.filter((user)=> user.room===room)


  return arr
  }

module.exports={
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}
