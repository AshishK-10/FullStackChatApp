const asyncHandler = require('express-async-handler') // handles all the async related errors in express
const Chat = require('../models/chatModel') //chat model
const User = require('../models/userModel')

const accessChat = asyncHandler(async(req, res)=>{

 const {userId} = req.body;
 if(!userId)
 {
  res.status(400);
  throw new Error("Please enter userId!");
 }

 var isChat = await Chat.find({
  isGroupChat: false,
  $and: [
    { users: { $elemMatch: { $eq: req.user._id } } }, // chat has (current user) as user of this chat
    { users: { $elemMatch: { $eq: userId } } }, // chat has (params user) as user of this chat
  ]
 })
 .populate('users', '-password') // get all the users of the chat
 .populate('latestMessage') // get the latest message of this chat

// returns the array of the users
 isChat = await User.populate(isChat, {
  path: 'latestMessage.sender', // go through the latestMessage of isChat and send the user id from which the User gives the data.
  select: 'name pic email' // only send the following data of the sender.
 })

 if(isChat.length > 0)
 {
  res.send(isChat[0]) // chats exists b/w loggedIn user and req.user.
 }else{
  var chatData = {
    chatName: "sender",
    isGroupChat: false,
    users: [req.user._id, userId],
  };

  try {
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findById(createdChat._id)
    .populate('users', '-password') // get all the users of the chat
    res.status(200).send(fullChat);
  } catch (error) {
     res.status(400);
     throw new Error(error);
  }
 }
})


const fetchChats = asyncHandler(async (req, res)=>{
  try {
       // find all the chats logged in user is part of.
      Chat.find({ users: { $elemMatch: { $eq: req.user._id }}})
      .populate('users', '-password')
      .populate('groupAdmin')
      .populate('latestMessage')
      .sort({updatedAt: -1})
      .then(async (results)=>{
        results = await User.populate(results, {
        path: 'latestMessage.sender', // go through the latestMessage and send the user id from which the User gives the data.
        select: 'name pic email' // only send the following data of the sender.
      })
      res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const createGroupChat = asyncHandler(async(req, res)=>{

 if(!req.body.users || !req.body.name)
 {
  res.status(400);
  throw new Error("Please fill all the fields");
 }
 var users = JSON.parse(req.body.users);
 users.push(req.user);

 if(users.length < 2)
 {
  return res.status(400).send("Cannot create group with less than 2 participants.");
 }

 try {
  const groupChat = await Chat.create({
    chatName: req.body.name,
    users: users,
    isGroupChat: true,
    groupAdmin: req.user,
  });

  const fullChat = await Chat.findById(groupChat._id)
  .populate('users', '-password') // get all the users of the chat
  res.status(200).send(fullChat);

 } catch (error) {
  res.status(400);
  throw new Error(error);
 }
});

const renameGroup = asyncHandler(async(req, res)=>{
 const { groupChatId, newChatName } = req.body;

 if(!groupChatId || !newChatName)
  {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

 const updatedChat = await Chat.findByIdAndUpdate(groupChatId,
  {chatName: newChatName},
  {new: true} // returns the updated object
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password");

  if(updatedChat)
  {
    res.status(200).send(updatedChat)
  }
  else{
    res.status(404);
    throw new Error("Group not found");
  }
});


const addToGroup = asyncHandler(async(req, res)=>{
  const {userId, groupId} = req.body;
  if(!userId || !groupId)
  {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const updatedChat = await Chat.findByIdAndUpdate(groupId,
    {$push: { users: userId }},
    {new: true}
    ).populate("users", "-password").populate("groupAdmin", "-password");
  if(updatedChat)
  {
    res.status(200).send(updatedChat)
  }
  else{
    res.status(404);
    throw new Error("Group not found");
  }
});

const removeFromGroup = asyncHandler(async(req, res)=>{
  const {userId, groupId} = req.body;
  if(!userId || !groupId)
  {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const updatedChat = await Chat.findByIdAndUpdate(groupId,
    {$pull: { users: userId }},
    {new: true}
    ).populate("users", "-password").populate("groupAdmin", "-password");
  if(updatedChat)
  {
    res.status(200).send(updatedChat)
  }
  else{
    res.status(404);
    throw new Error("Group not found");
  }
});

module.exports = {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup}