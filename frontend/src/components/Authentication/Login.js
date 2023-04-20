import React, {useState} from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useStatStyles, VStack } from '@chakra-ui/react'
import { ViewOffIcon, ViewIcon } from '@chakra-ui/icons'

const Login = () => {

  const [name, setName] = useState('')
  const [email,setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pic, setPic] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const submitDetails = ()=>{
  }

  return (
    <VStack spacing = '5px'>

      <FormControl id = "email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder = "enter your email" onChange = {(e)=>{setEmail(e.target.value)}}/>
      </FormControl>

      <FormControl id = "password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
         <Input type = {showPassword ? 'text' : 'password'} placeholder = "enter your password" onChange = {(e)=>{setPassword(e.target.value)}}/>
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
      >
        Login
      </Button>

      <Button
       variant="solid"
       colorScheme="red"
       width="100%"
       mt={15}
       onClick={()=>{setEmail("guest@email.com"); setPassword("test1234")}}
      >
        Get Guest Credentials
      </Button>
    </VStack>
  )
}

export default Login