import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../Context/ChatProvider';

const UserBadgeItem = ({user, handleFunction}) => {
  const currUser = ChatState();
  let loggedUser = currUser.user;
  return (
    <Box
     px={2}
     py={1}
     borderRadius="lg"
     m={1}
     mb={2}
     variant="solid"
     fontSize={12}
     backgroundColor={user._id === loggedUser._id ?  "green" : "purple"}
     color="white"
     cursor="pointer"
     onClick={handleFunction}
     key={user.id}
    >
      {user._id === loggedUser._id ?  "You" : user.name}
      <CloseIcon pl={1}/>
    </Box>
  )
}

export default UserBadgeItem
