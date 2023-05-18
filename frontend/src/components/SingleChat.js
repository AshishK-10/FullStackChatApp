import React, { useEffect, useState } from 'react'
import { ChatState } from './Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/chatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css'
import ScrollabeChat from './ScrollabeChat';
import io from 'socket.io-client'
import Lottie from "react-lottie";
import animationData from '../animations/typing.json'


const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {user, selectedChat, setSelectedChat, notification, setNotification} = ChatState();
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('');
  const toast = useToast();
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const[isTyping, setIsTyping] = useState(false);


  const defaultOptions = {
    loop: true,
    autoPlay: true,
    animationData: animationData,
    renderSettings: {
      preserveAspectRatio: "xMiddYMid slice"
    }
  }
  const fetchMessages = async()=>{
    if(!selectedChat) return;
    try{
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios
      .get(
          `/api/message/${selectedChat._id}`,
          config
        )
      .then((res) => {
          setLoading(false)
          setMessages(res.data);
          socket.emit('join chat', selectedChat._id)
        })
      .catch( (error) => {
        setLoading(false)
        toast({
          title: `${error.message}`,
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        })
      })
    }catch(error){
      setLoading(false)
      toast({
        title: 'Something went wrong',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  const sendMessage = async (event)=> {
    if(event.key === 'Enter' && newMessage)
    {
      try {
        setNewMessage("");
        const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios
      .post(
          `/api/message`,{content: newMessage, chatId: selectedChat._id},
          config
        )
      .then((res) => {
          setMessages([...messages, res.data]);
          socket.emit('new message', res.data);
          socket.emit('stop typing', selectedChat._id)
        })
      .catch( (error) => {
        toast({
          title: `${error.message}`,
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        })
      })
      }catch(error){
        toast({
          title: 'Something went wrong',
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        })
      }
    }
  }

  const typingHandler = (e)=>{
    setNewMessage(e.target.value);
    if(!socketConnected) return;
    if(!typing){
      setTyping(true);
      socket.emit('typing', selectedChat._id) // send the 'typing' to the selectedChat._id room
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime
      if(timeDiff >= timerLength && typing)
      {
        socket.emit('stop typing', selectedChat._id)
        setTyping(false);
      }
    }, timerLength);
  }

  useEffect(()=>{
   socket = io(ENDPOINT)
   socket.emit("setup", user)
   socket.on("connected", () => setSocketConnected(true))
   socket.on("typing", ()=>setIsTyping(true));
   socket.on("stop typing", ()=>setIsTyping(false));
  }, [])

  useEffect(() => {
   fetchMessages();
   selectedChatCompare = selectedChat;
  }, [selectedChat])

  useEffect(() => {
   socket.on("messageReceived", (newMessageReceived) => {
    if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
      if(!notification?.includes(newMessageReceived)){
        setNotification([newMessageReceived, ...notification]);
      }
    }else{
      setMessages([...messages, newMessageReceived]);
    }
   })
  })

  const saveNotification = async ()=>{

    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios
      .put(
          `/api/notification`,{messages: notification},
          config
        )
      .then((res) => {
        setFetchAgain(!fetchAgain);
        })
      .catch( (error) => {
        toast({
          title: `${error.message}`,
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        })
      })
    }catch(error){
      toast({
        title: 'Something went wrong',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  useEffect(() => {
    saveNotification();
  }, [notification])

  return (
    <>
    {
      selectedChat ? (
        <>
         <Text
          fontSize={{ base: "28px", md: "30px" }}
          pb={3}
          px={2}
          w="100%"
          fontFamily="Work sans"
          display="flex"
          justifyContent={{ base: "space-between" }}
          alignItems="center"
         >
          <IconButton
           display={{base: "flex", md: "none"}}
           icon = {<ArrowBackIcon/>}
           onClick={()=> setSelectedChat("")}
          />
          {
            !selectedChat.isGroupChat ? (
              <>
               {getSender(user, selectedChat.users)}
               <ProfileModal user = {getSenderFull(user, selectedChat.users)} />
              </>
            ):(
               <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                 fetchAgain = {fetchAgain}
                 setFetchAgain = {setFetchAgain}
                 fetchMessages={fetchMessages}
                />
               </>
              )
          }
         </Text>
         <Box
          display="flex"
          flexDir="column"
          justifyContent="flex-end"
          p={3}
          bg="#E8E8E8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
         >
           {loading ? ( <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto"/>) :
           (
             <div
              className="messages"
             >
              <ScrollabeChat messages = {messages} />
             </div>
           )}

           <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            {isTyping ? <div><Lottie  options={defaultOptions} width={70} style={{marginBottom:15, marginLeft: 0}}/></div> : <></>}
            <Input
             variant="filled"
             bg="#E0E0E0"
             placeholder='Enter a message'
             onChange={typingHandler}
             value={newMessage}
            />
           </FormControl>
         </Box>
        </>
      ):(
        <Box
         display="flex" alignItems="center" justifyContent="center" h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Say it with a message.
          </Text>
        </Box>
      )
    }
    </>
  )
}

export default SingleChat
