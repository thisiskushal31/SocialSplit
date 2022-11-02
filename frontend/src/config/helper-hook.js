import { useContext} from 'react';
import ChatContext from '../Context/chat-context';


export const useHelper = ()=>{
  
  const {chats, user} = useContext(ChatContext);

  const getSender = (i) => {
    const chatName = chats.map((chat)=>{
      return chat.users[0]._id === user._id ? chat.users[1].name : chat.users[0].name
    });
    return chatName[i];
  };

  return {getSender,} ;
}