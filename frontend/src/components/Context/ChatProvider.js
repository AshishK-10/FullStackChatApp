import React, { createContext, useContext, useState, useEffect } from "react";
import {useHistory} from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const ChatContext = createContext()

const ChatProvider = ({children})=>{
  const [user, setUser] = useState("");
  const history =  useHistory();
  const [selectedChat, setSelectedChat] = useState("");
  const [chats, setChats] = useState([])
  const [fetchAgain, setFetchAgain] = useState(false);
  const [notification, setNotification] = useState([])
  const toast = useToast();


  const setNotifications = async (user)=>{
   try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios
      .get(
          `/api/notification`,
          config
        )
      .then((res) => {
         // save res.data
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
        title: error.message,
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem("userInfo"));
    setUser(details);
    if(!user){
       history.push('/')}
  }, [history,fetchAgain])

  useEffect(() => {
    if(user)
      setNotifications(user);
  }, [user])

  return (
    <ChatContext.Provider value = {{user, setUser, selectedChat, setSelectedChat, chats, setChats, fetchAgain, setFetchAgain, notification, setNotification}}>
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = ()=>{
 return useContext(ChatContext)
};



export default ChatProvider;