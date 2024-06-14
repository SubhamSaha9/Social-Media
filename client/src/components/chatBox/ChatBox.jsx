import React, { useEffect, useRef, useState } from 'react'
import './ChatBox.css'
import { getUser } from '../../api/userRequest';
import { addMessage, getMessages } from '../../api/messageRequest';
import {format} from 'timeago.js';
import InputEmoji from 'react-input-emoji';

const ChatBox = ({chat, currentUser,setSendMessage, receivedMessage}) => {

    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
  const link = "https://res.cloudinary.com/dvmweuskc/image/upload/v1717011612/posts/";

    const handleChange = (newMessage)=>{
        setNewMessage(newMessage)
    }

    useEffect(()=>{
        const userId = chat?.members?.find((id) => id !== currentUser);
        const getUserData = async()=>{
            try {
                const {data} = await getUser(userId);
                setUserData(data);
            } catch (error) {
                console.log(error);
            }
        }
        if (chat !== null) getUserData();
    }, [chat, currentUser])

    useEffect(()=>{
        const fetchMessages = async()=>{
            try {
                const {data} = await getMessages(chat._id);
                setMessages(data);
            } catch (error) {
                console.log(error);
            }
        }
        if(chat !== null) fetchMessages();
    }, [chat])

    const handelSend =async (e)=>{
        e.preventDefault();
        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chat._id
        }

        try {
            const {data} = await addMessage(message);
            setMessages([...messages, data]);
            setNewMessage("");
        } catch (error) {
            console.log(error)
        }

        const receiverId = chat.members.find((id)=> id!== currentUser);
        setSendMessage({...message, receiverId});
    }

    useEffect(()=>{
        if(receivedMessage !== null && receivedMessage.chatId === chat._id){
            setMessages([...messages,receivedMessage]);
        }
    },[receivedMessage])

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"});
    },[messages])


    const scroll = useRef();
    const imageRef = useRef();

  return (
    <>
        <div className="ChatBox-container">
            {chat? (
                <>
                    <div className="chat-header">
                        <div className="follower">
                            <div>
                                <img src={userData?.profilePicture? link + userData.profilePicture : link + "defaultProfile_eza0ea.png"} alt="profilePicture" className="followerImage" style={{ width: "50px", height: "50px" }}/>
                                <div className="name" style={{fontSize: '0.9rem'}}>
                                    <span>{userData?.firstname} {userData?.lastname}</span>
                                </div>
                            </div>
                        </div>
                        <hr style={{ width: "95%", border: "0.1px solid #ececec", marginTop: "20px"}} />
                    </div>
                    <div className="chat-body">
                        {messages.map((message)=>(
                            <>
                                <div className={ message.senderId === currentUser ? "message own" : "message" } ref={scroll}>
                                    <span>{message.text}</span>{" "}
                                    <span>{format(message.createdAt)}</span>
                                </div>
                            
                            </>
                        ))}
                    </div>
                    {/* chaat sender */}
                    <div className="chat-sender">
                        <div onClick={() => imageRef.current.click()}>+</div>
                        <InputEmoji value={newMessage} onChange={handleChange}/>
                        <div className="send-button button" onClick={handelSend}>Send</div>
                        <input type="file" accept='image/*' name="" id="" style={{ display: "none" }} ref={imageRef} />
                    </div>
                </>
            ) : (
                <span className="chatbox-empty-message">
                    Tap on a chat to start conversation...
                </span>
            )}
        </div>
    </>
  )
}

export default ChatBox
