import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList,  Text,  Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import {Spinner} from '@chakra-ui/spinner'
import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar} from '@chakra-ui/react'
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import ChatLoading from '../ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { ChatState } from '../Context/ChatProvider';

const SideDrawer = ({user}) => {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const {selectedChat, setSelectedChat, chats, setChats, setUser } = ChatState();

  const logOut = ()=>{
    setUser("")
    setChats([])
    setSelectedChat('');
    localStorage.removeItem("userInfo");
    history.push("/")
  }

  const handleSearch = async ()=>{
    setLoading(true)

    if(!search) {
      toast({
        title: "Search field is empty!",
        status: 'warning',
        duration: 1000,
        isClosable: true,
        position: "top-left"
      })
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios
      .get(
          `/api/user?search=${search}`,
          config
        )
      .then((res) => {
          setSearchResult(res.data)
          setLoading(false)
        })
      .catch( (error) => {
        toast({
        title: `Something went wrong`,
        status: 'warning',
        duration: 2000,
        isClosable: true,
        })
        setLoading(false);
      })
    } catch (error) {
        toast({
          title: 'Something went wrong',
          status: 'warning',
          duration: 2000,
          isClosable: true,
        })
        setLoading(false);
    }
  }

  const accessChat = async (userId)=>{
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios
      .post(
          `/api/chat`, {userId},
          config
        )
      .then((res) => {
          if(!chats.find((c) => c._id === res.data._id))
           setChats([res.data, ...chats]);

          setSelectedChat(res.data)
          setLoadingChat(false)
        })
        .catch( (error) => {
          toast({
          title: `Something went wrong test case, ${error}`,
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
          })
          setLoadingChat(false)
        })

    } catch (error) {
      toast({
          title: 'Error fetching the chats',
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        })
        setLoadingChat(false)
    }
  }

  return (
    <>
      <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
      >
        <Tooltip
          label = "Search users to chat"
          hasArrow
          placement = "bottom-end">
          <Button variant = "ghost" onClick={onOpen}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text
        fontSize="2xl"
        fontFamily="Work sans"
        >
        Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
            <BellIcon fontSize="2xl" m={1}/>
            {/* <MenuList></MenuList> */}
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
              <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic}/>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider/>
              <MenuItem onClick={logOut}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomRadius="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
              placeholder="Search by name or email"
              mr={2}
              value={search}
              onChange = {(e) => setSearch(e.target.value)}
              />
              <Button onClick = {handleSearch}>
                Go
              </Button>
            </Box>
            {loading ? (
               <ChatLoading/>
            ):(
               searchResult?.map(user => (
                <UserListItem
                 key={user._id}
                 user={user}
                 handleFunction={()=>accessChat(user._id)}
                 />
               ))
            )}
            {loadingChat && <Spinner ml="auto" display= "flex"/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer
