import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {ChatState} from '../components/Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import MyChats from '../components/miscellaneous/MyChats'
import ChatBox from '../components/miscellaneous/ChatBox'
import { useHistory } from 'react-router-dom'

const Chatpage = () => {
  const [user, setCurrUser] = useState('')
  const history = useHistory();

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem("userInfo"));
    setCurrUser(details);

    if(!details){
       history.push('/')}
  }, [history])

  return (
    <div style= {{width: '100%'}}>
      {user && <SideDrawer user={user}/>}
      <Box
      height="90%"
      >
        {user && <MyChats/>}
        {/* {user && <ChatBox/>} */}
      </Box>
    </div>
  )
}

export default Chatpage
