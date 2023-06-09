const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");


const sendMessage = asyncHandler(async (req, res)=>{
 const {content, chatId} = req.body;

 if(!content || !chatId){
  res.status(400);
  throw new Error("Please fill all the fields");
 }

 var newMessage = {
  sender: req.user._id,
  content: content,
  chat: chatId,
 };

 try {
  var message = await Message.create(newMessage)
  message = await message.populate("sender", "name pic");
  message = await message.populate("chat");

  message = await User.populate(message, {
    path: 'chat.users',
    select: 'name pic email'
  });

  await Chat.findByIdAndUpdate(req.body.chatId, { // chat will have this as the latest message
    latestMessage: message,
  });

  res.json(message);

 } catch (error) {
  res.status(404);
  throw new Error(error.message);
 }
});

const allMessages = asyncHandler(async (req, res)=>{

 try {
  const messages = await Message.find({ chat: req.params.chatId })
  .populate("sender", "name pic email")
  .populate("chat")

  res.json(messages);

 } catch (error) {
   res.status(400);
   throw new Error(error.message);
 }

});


const updateNotification = asyncHandler(async (req, res)=> {

  const {messages} = req.body
  try {
    const updatedNotification = await User.findByIdAndUpdate(req.user._id, {
      notification: messages
    },{new: true})
    res.status(200).send(updatedNotification);
  } catch (error) {
    res.status(404);
    throw new Error(error.message);
  }
})


const getNotify = asyncHandler(async(req, res) => {
  try {
    const userNotifications = await User.findById(req.user._id).populate('notification');
    res.json(userNotifications.notification);
  } catch (error) {
    res.status(404);
    throw new Error(error.message);
  }
})

module.exports = {sendMessage, allMessages, updateNotification, getNotify}