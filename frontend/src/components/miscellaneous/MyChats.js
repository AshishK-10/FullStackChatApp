import { useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios'

const MyChats = () => {
  const {user, setUser, selectedChat, setSelectedChat, chats, setChats} = ChatState();
  const [loggedUser, setloggedUser] = useState();
  const toast = useToast();
  
  const fetchChats = async()=>{
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios
      .get(
          `/api/user`,
          config
        )
      .then((res) => {
          setChats(res.data)
        })
      .catch( (error) => {
        toast({
        title: 'Something went wrong',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
      })
    } catch (error) {
      toast({
        title: 'Something went wrong',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
    }
  }

  useEffect(()=>{
   setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
   fetchChats();
  }, [])

  return (
    <div></div>
  )
}

export default MyChats
