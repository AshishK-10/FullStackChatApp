const express = require('express')
const dotenv = require("dotenv")
const {chats} = require('./data/data')
const cors = require('cors')
const connectDb = require('./config/db')
const colors = require('colors')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const {notFound, errorHandler} = require('./middleware/errorMiddleware')
const app = express();

dotenv.config();
connectDb(); //connected db

app.use(express.json());
app.use(cors());
app.use(express.json()); // to accept the json data

app.use('/api/user', userRoutes) // /api/user routes
app.use('/api/chat', chatRoutes) // api/chat routes
app.use('/api/message', messageRoutes) // api/message routes
app.use('/api/notification', notificationRoutes) // api/notification routes
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000;
const server = app.listen(5000, console.log(`server started on port ${port}`.yellow.bold))

const io = require('socket.io')(server, {
  pingTimeout: 60000, // timeout time to save bandwidth
  cors: {
    origin: "http://localhost:3001",
  }
});

io.on("connection", (socket) => {

 socket.on('setup', (userData)=> { // initialization
  socket.join(userData._id);
  socket.emit('connected');
 })

 socket.on('join chat', (room) => { // joining a chat with room = selectedChat._id
  socket.join(room);
  console.log('user joined room', room);
 });

 socket.on('new message', (newMessageReceived)=> {  //receiving new messages
  var chat = newMessageReceived.chat;
  if(!chat.users) return console.log('chat.users is not defined');
  chat.users.forEach(user => {
    if(chat._id === newMessageReceived.sender._id) return;
    socket.in(user._id).emit("messageReceived", newMessageReceived) // emit message to all the room having user._id
  })
 })

//all the sockets in room should emit "typing" or "stop typing" when listed to this port
 socket.on('typing', (room)=> socket.in(room).emit("typing"));
 socket.on('stop typing', (room)=> socket.in(room).emit("stop typing"));

 socket.off("setup", ()=>{
  console.log("user disconnected");
  socket.leave(userData._id)
 })
});
