import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from '../config/chatLogics'
import { ChatState } from './Context/ChatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'

const ScrollabeChat = ({messages}) => {
  const {user} = ChatState();

  return (
    <ScrollableFeed>
      {messages && messages.map((message, index) => (
        <div style ={{ display: "flex"}} key = {message._id}>
           {
             (isSameSender(messages, message, index, user._id)
             || isLastMessage(messages, index, user._id)
           ) && (
              <Tooltip
               label={message.sender.name}
               placement="bottom-start"
               hasArrow
              >
                <Avatar
                 mt="7px"
                 mr={1}
                 size="sm"
                 cursor="pointer"
                 name={message.sender._id}
                 src={message.sender.pic}
                />
              </Tooltip>
           )}
           <span style = {{ backgroundColor: `${message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
           borderRadius: "20px",
           padding: "5px 15px",
           maxWidth: "75%",
           marginLeft: isSameSenderMargin(messages, message, index, user._id),
           marginTop: isSameUser(messages, message, index, user._id) ? 3 : 10,

          }}>
            {message.content}
           </span>
        </div>
      ))}
    </ScrollableFeed>
  )
}

export default ScrollabeChat
