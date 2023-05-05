import React, {useState} from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useStatStyles, VStack, useToast} from '@chakra-ui/react'
import { ViewOffIcon, ViewIcon } from '@chakra-ui/icons'
import axios from 'axios'
import {useHistory} from "react-router-dom"

const Login = () => {

  const [email,setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const history = useHistory()

  const submitDetails = async ()=>{
    setLoading(true);
    if(!email || !password)
    {
      toast({
        title: 'Error',
        description: "Please fill all the details",
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axios
        .post(
          `/api/user/login`,
          { email, password },
          config
        )
        .then((res) => {
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          setLoading(false);
          toast({
          title: `Welcome back ${res.data.name}`,
          status: 'success',
          duration: 2000,
          isClosable: true,
          })
          setLoading(false);
          history.push('/chats')
        })
        .catch( (error) => {
          toast({
          title: 'Login Failed',
          description: error.response.data.message,
          status: 'warning',
          duration: 2000,
          isClosable: true,
          })
          setLoading(false);
        })
    }catch (error) {
      toast({
          title: 'Error',
          description: "Something went wrong!",
          status: 'warning',
          duration: 2000,
          isClosable: true,
          })
      setLoading(false);
    }
  }

  return (
    <VStack spacing = '5px'>

      <FormControl id = "email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder = "enter your email" onChange = {(e)=>{setEmail(e.target.value)}} value = {email}/>
      </FormControl>

      <FormControl id = "password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
         <Input type = {showPassword ? 'text' : 'password'} placeholder = "enter your password" onChange = {(e)=>{setPassword(e.target.value)}} value = {password}/>
         <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={(e)=>setShowPassword(!showPassword)}>
           {showPassword ? <ViewIcon boxSize={6}/> : <ViewOffIcon boxSize={6}/>}
          </Button>
         </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
       colorScheme="blue"
       width="100%"
       mt={15}
       onClick={submitDetails}
       isLoading = {loading}
      >
        Login
      </Button>

      <Button
       variant="solid"
       colorScheme="red"
       width="100%"
       mt={15}
       isLoading = {loading}
       onClick={()=>{setEmail("guest@email.com"); setPassword("test1234")}}
      >
        Get Guest Credentials
      </Button>
    </VStack>
  )
}

export default Login
