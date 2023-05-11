import { ViewIcon } from '@chakra-ui/icons'
import {Spinner, Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {user, selectedChat, setSelectedChat} = ChatState();
  const[groupChatName, setGroupChatName] = useState('')
  const [search, setSearch] = useState()
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)
  const toast = useToast();


  const handleRemove = async(userToRemove)=>{

    if(selectedChat.groupAdmin._id !== user._id)
    {
      toast({
        title: 'Only group admins can remove someone',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
        return;
    }

    try {
     setLoading(true)
     const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios
      .put(
          `/api/chat/groupremove`,{userId: userToRemove._id, groupId: selectedChat._id},
          config
        )
      .then((res) => {
          userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(res.data);
          setSearchResult([])
          setFetchAgain(!fetchAgain)
          setLoading(false);
        })
      .catch( (error) => {
        setLoading(false)
        toast({
        title: 'Something went wrong',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
      })
    }catch(error){
      setLoading(false)
      toast({
        title: `${error?.message}`,
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
    }

  }

  const handleRename = async ()=>{

    if(!groupChatName)
     return;

    try {
      setRenameLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios
      .put(
          `/api/chat/rename`,{groupChatId: selectedChat._id, newChatName: groupChatName},
          config
        )
      .then((res) => {
          setSelectedChat(res.data)
          setFetchAgain(!fetchAgain)
          setRenameLoading(false)
        })
      .catch( (error) => {
        toast({
        title: 'Something went wrong',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
        setRenameLoading(false)
      })
    } catch (error) {
      toast({
        title: 'Something went wrong',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
        setRenameLoading(false)
    }
  }

  const handleSearch = async(query) => {
    setSearch(query)
   if(!query)
   {
    return;
   }

   try{
     setLoading(true)
     const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios
      .get(
          `/api/user?search=${query}`,
          config
        )
      .then((res) => {
          setSearchResult(res.data)
          setLoading(false)
        })
      .catch( (error) => {
        toast({
        title: 'Something went wrong',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
        setLoading(false)
      })
   }catch(error){
    toast({
        title: 'Something went wrong',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
     setLoading(false);
   }
  }

  const handleAddUser = async(userToAdd)=>{

    if(selectedChat.users.find((u)=> u._id === userToAdd._id)){
      toast({
        title: 'User is already added',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
        return;
    }
    if(selectedChat.groupAdmin._id !== user._id)
    {
      toast({
        title: 'Only group admins can add someone',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
        return;
    }

    try {
     setLoading(true)
     const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios
      .put(
          `/api/chat/groupadd`,{userId: userToAdd._id, groupId: selectedChat._id},
          config
        )
      .then((res) => {
          setSelectedChat(res.data);
          setFetchAgain(!fetchAgain)
          setLoading(false);
        })
      .catch( (error) => {
        setLoading(false)
        toast({
        title: 'Something went wrong',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
        setLoading(false);
      })
    }catch(error){
      setLoading(false)
      toast({
        title: `${error?.message}`,
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
        setLoading(false);
    }
  }
  return (
    <>
      <IconButton display={{base: "flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
           fontSize = "35px"
           fontFamily="Work sans"
           display="flex"
           justifyContent="center"
          >
            {selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat?.users?.map(u=> (
                <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleRemove(u)}/>
              ))}
            </Box>
            <FormControl display="flex">
             <Input
              placeholder = "Chat Name"
              mb={3}
              value={groupChatName}
              onChange={(e)=> setGroupChatName(e.target.value)}
             />
             <Button
              variant="solid"
              colorScheme="teal"
              ml={1}
              isLoading={renameLoading}
              onClick={handleRename}
             >
              Update
             </Button>
            </FormControl>

            <FormControl>
              <Input
               placeholder="Add Users"
               mb={1}
               onChange={(e)=>handleSearch(e.target.value)}
              />
            </FormControl>
              {loading ? (<Spinner ml="auto" display= "flex"/>) : (
                searchResult?.slice(0, 4).map(user=> (
                    <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUser(user)}/>
                  ))
              )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={()=> handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
