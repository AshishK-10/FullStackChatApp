import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import UserListItem from '../UserAvatar/UserListItem'

const GroupChatModal = ({children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])
  const [search, setSearch] = useState()
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)

  const toast = useToast();
  const {user, setChats, chats} = ChatState();

  const handleSearch = async (query)=>{
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

  const handleGroup = (userToAdd)=>{
    if(selectedUsers.includes(userToAdd)){
      toast({
        title: 'User is already added',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
    }else{
      setSelectedUsers([...selectedUsers, userToAdd]);
    }
  }

  const handleSubmit = async ()=>{
    if(!groupChatName || !selectedUsers){
      toast({
        title: 'Please enter all the details',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
      return;
    }
    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios
      .post(
          `/api/chat/group`,{name: groupChatName, users: JSON.stringify(selectedUsers.map(u=>u._id))},
          config
        )
      .then((res) => {
          setChats([res.data, ...chats])
          onClose();
          toast({
            title: 'New Group Created',
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: "bottom-left",
          })
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
    }catch(error){
      toast({
        title: `${error?.message}`,
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        })
    }
  }

  const handleDelete = (delUser)=>{
    setSelectedUsers(selectedUsers.filter((user => user._id !== delUser._id)))
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
           fontSize="35px"
           fontFamily="Work sans"
           display="flex"
           justifyContent="center"
          >
            New Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
               placeholder="Group Name"
               mb={3}
               onChange={(e)=>setGroupChatName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Input
               placeholder="Add Users"
               mb={1}
               onChange={(e)=>handleSearch(e.target.value)}
              />
            </FormControl>
            <Box
            w ="100%"
            display="flex"
            flexWrap="wrap"
            >
              {
                selectedUsers?.map(user=>(
                  <UserBadgeItem key={user._id} user={user} handleFunction={()=>handleDelete(user)}/>
                ))
              }

              {loading ? <Spinner ml="auto" display= "flex"/> : (
                searchResult?.slice(0, 4).map(user=> (
                  <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
                ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
