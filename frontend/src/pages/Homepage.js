import React, {useEffect} from 'react'
import './Homepage.css'
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import {useHistory} from "react-router-dom"
import Animation from '../components/Animation'

const Homepage = () => {

  const history = useHistory()

  useEffect(() => {
   const details = JSON.parse(localStorage.getItem("userInfo"));
   console.log(history)
   if(details) history.push('/chats')
  }, [history])

  return (
    <Container maxW="xl" centerContent>
      <Box
       display= "flex"
       justifyContent='center'
       p={3}
       bg={'white'}
       w="100%"
       m="40px 0 15px 0"
       borderRadius="lg"
       borderWidth="1px"
      >
        <Text fontSize= '4xl' fontFamily={"Work sans"} color = "black">Talk-A-Tive</Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" color = "black">
        <Tabs position="relative" zIndex="999" variant='soft-rounded'>
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
             {<Login/>}
            </TabPanel>
            <TabPanel>
              {<Signup/>}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Animation/>
    </Container>
  )
}


export default Homepage
