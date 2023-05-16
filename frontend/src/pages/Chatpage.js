import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {ChatState} from '../components/Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import MyChats from '../components/miscellaneous/MyChats'
import ChatBox from '../components/miscellaneous/ChatBox'
import { useHistory } from 'react-router-dom'

const Chatpage = () => {
  const {user} = ChatState()
  const history = useHistory();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style= {{width: '100%'}}>
      {user && <SideDrawer user={user}/>}
      <Box
      height="90%"
      maxHeight="90vh"
      display="flex"
      flexDir="row"
      >
        {user && <MyChats fetchAgain = {fetchAgain}/>}
        {user && <ChatBox fetchAgain = {fetchAgain} setFetchAgain = {setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default Chatpage
