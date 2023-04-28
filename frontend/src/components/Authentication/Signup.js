import React, {useState} from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useStatStyles, VStack, useToast } from '@chakra-ui/react'
import { ViewOffIcon, ViewIcon } from '@chakra-ui/icons'
import axios from 'axios'
import {useHistory} from "react-router-dom"

const Signup = () => {

  const [name, setName] = useState('')
  const [email,setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pic, setPic] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const history = useHistory()

  const uploadPic = async (pic)=>
  {
    setLoading(true);
    if (pic === undefined) {
      toast({
          title: 'Invalid Image',
          description: "Please upload a valid picture.",
          status: 'Warning',
          duration: 3000,
          isClosable: true,
        })
      setLoading(false);
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dnsbti7cd");
     axios.post(`https://api.cloudinary.com/v1_1/dnsbti7cd/image/upload`, data)
      .then((res) => res.data)
      .then((data) => {
          setPic(data.url.toString());
          toast({
          title: 'Profile Uploaded',
          description: "Profile pic uploaded successfully!",
          status: 'success',
          duration: 2000,
          isClosable: true,
          })
          setLoading(false);
        })
      .catch((err) => {
        toast({
        title: 'Error',
        description: "Something went wrong!",
        status: 'warning',
        duration: 3000,
        isClosable: true,
        })
        setLoading(false);
      });
    } else {
      toast({
        title: 'Error',
        description: "Upload only image",
        status: 'Warning',
        duration: 3000,
        isClosable: true,
      })
      setLoading(false);
      return;
    }
  };


  const submitDetails = async ()=>{
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Error',
        description: "Please fill all the details",
        status: 'Warning',
        duration: 3000,
        isClosable: true,
      })
      setLoading(false);
      return;
    }

    if (confirmPassword !== password) {
      toast({
        title: 'Error',
        description: "Passwords don't match",
        status: 'Warning',
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
          `http://localhost:5000/api/user`,
          { name, email, password, pic },
          config
        )
        .then((res) => {
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          setLoading(false);
          toast({
          title: 'Account Created!',
          description: "Registration successfull!",
          status: 'success',
          duration: 2000,
          isClosable: true,
          })
          setLoading(false);
          history.push('/chats')
        })
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  return (
    <VStack spacing = '5px'>
      <FormControl id = "first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder = "enter your name" onChange = {(e)=>{setName(e.target.value)}}/>
      </FormControl>

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

      <FormControl id = "confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
         <Input type = {showPassword ? 'text' : 'password'} placeholder = "re-enter your password" onChange = {(e)=>{setConfirmPassword(e.target.value)}}/>
         <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={(e)=>setShowPassword(!showPassword)}>
           {showPassword ? <ViewIcon boxSize={6}/> : <ViewOffIcon boxSize={6}/>}
          </Button>
         </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id = "pic" isRequired>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
         type = {"file"}
         p={1.5}
         accept='image/*'
         onChange = {(e)=>{uploadPic(e.target.files[0])}}
         />
      </FormControl>

      <Button
       colorScheme='blue'
       width="100%"
       mt={15}
       onClick={submitDetails}
       isLoading = {loading}
      >
        SignUp
      </Button>
    </VStack>
  )
}

export default Signup
