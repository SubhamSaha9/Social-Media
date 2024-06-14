import React, { useState } from 'react'
import './User.css'
import { useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import { followUser, unfollowUser } from '../../actions/userAction';
import { createChat } from '../../api/chatRequest';
const User = ({person, id}) => {

    const dispatch = useDispatch()    
    const link = "https://res.cloudinary.com/dvmweuskc/image/upload/v1717011612/posts/";
    const {user} = useSelector((state)=> state.authReducer.authData);
    const [following, setFollowing] = useState(person.followers.includes(user._id));

    const handleFollow = async()=>{
        if(following){
            dispatch(unfollowUser(person._id, user));
        }else{
            dispatch(followUser(person._id, user));
            let data = {
                senderId: user._id,
                receiverId: person._id
            }
            try {
                const newChat = await createChat(data);
                console.log(newChat);
            } catch (error) {
                console.log(error);
            }
        }
        setFollowing((prev)=> !prev);
    }

  return (
    <div className="follower">
        <div>
            <img src={person.profilePicture? link+person.profilePicture : link + "defaultProfile_eza0ea.png"} alt="" className='followerImage' />
            <div className="name">
                <Link to = {`/profile/${person._id}`}  style={{cursor:"pointer", textDecoration:"none", color:"black"}}>
                        <span><b>{person.firstname} {person.lastname}</b></span><br />
                        <span>{person.username}</span>
                </Link>
            </div>
        </div>
        <button className={following ? "button fc-button UnfollowButton" : "button fc-button"} onClick={handleFollow}>
            {following? "Unfollow" : "Follow"}
        </button>
    </div>
  )
}

export default User
