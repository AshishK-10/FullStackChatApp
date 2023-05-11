import React, { createContext, useContext, useState, useEffect } from "react";
import {useHistory} from "react-router-dom";


const ChatContext = createContext()

const ChatProvider = ({children})=>{
  const [user, setUser] = useState("");
  const history =  useHistory();
  const [selectedChat, setSelectedChat] = useState("");
  const [chats, setChats] = useState([])
  const [fetchAgain, setFetchAgain] = useState(false);


  useEffect(() => {
    const details = JSON.parse(localStorage.getItem("userInfo"));
    setUser(details);
    if(!user){
       history.push('/')}
  }, [history,fetchAgain])

  return (
    <ChatContext.Provider value = {{user, setUser, selectedChat, setSelectedChat, chats, setChats, fetchAgain, setFetchAgain}}>
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = ()=>{
 return useContext(ChatContext)
};



export default ChatProvider;