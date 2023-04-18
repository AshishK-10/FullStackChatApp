import React, { useEffect } from 'react'
import axios from 'axios'

const Chatpage = () => {

  const fetchChats = async ()=>{
    const {data} = await axios.get("/api/chat")
    console.log(data.chats)
  }

  useEffect(()=>{
    fetchChats()
  }, [])

  return (
    <div>
      Chatpage
    </div>
  )
}

export default Chatpage
