import React, { useEffect, useRef, useState } from 'react'
import './Chat.css'
import LogoSearch from '../../components/logoSearch/LogoSearch'
import {useSelector} from 'react-redux';
import { userChats } from '../../api/chatRequest';
import Conversation from '../../components/conversation/Conversation';
import NavIcons from '../../components/navIcons/NavIcons';
import ChatBox from '../../components/chatBox/ChatBox';
import {io} from 'socket.io-client';

const Chat = () => {

    const {user} = useSelector((state)=>state.authReducer.authData);
    const socket = useRef()

    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat]= useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sendMessage, setSendMessage] = useState(null);
    const [receivedMessage, setReceivedMessage] = useState(null);

    

    useEffect(()=>{
        const getChats = async()=>{
            try {
                const {data} = await userChats(user._id);
                setChats(data);
            } catch (error) {
                console.log(error);
            }
        }
        getChats();
    }, [user]);

    useEffect(()=>{
        socket.current = io("https://social-media-yf7p.onrender.com");
        socket.current.emit("new-user-add", user._id);
        socket.current.on("get-users", (users) => {
            setOnlineUsers(users);
        });
    }, [user])

    useEffect(()=>{
        if(sendMessage !== null){
            socket.current.emit("send-message", sendMessage);
        }
    },[sendMessage])

    useEffect(()=>{
        socket.current.on('recieve-message',(data)=>{
            setReceivedMessage(data);
        })
    },[])

    const checkOnlineStatus =(chat)=>{
        const chatMember = chat.members.find((member) => member !== user._id);
        const online = onlineUsers.find((user) => user.userId === chatMember);
        return online ? true : false;
    }

  return (
    <div className='Chat'>
      {/* left side */}
      <div className="Left-side-chat">
        <LogoSearch/>
        <div className="Chat-container">
            <h2>Chats</h2>
            <div className="Chat-list">
                {chats.map((chat)=>(
                    <div onClick={()=>setCurrentChat(chat)}>
                        <Conversation data={chat} currentUserId={user._id} online={checkOnlineStatus(chat)} />
                    </div>
                ))}
            </div>
        </div>
      </div>
      {/* right side */}
      <div className="Right-side-chat">
        <div style={{width: "20rem", alignSelf: "flex-end"}}>
            <NavIcons/>
        </div>
        {/* chat body */}
        <ChatBox chat={currentChat} currentUser={user._id} setSendMessage={setSendMessage} receivedMessage={receivedMessage}/>
      </div>
    </div>
  )
}
export default Chat
