import React, { useEffect, useState } from 'react'
import './ProfileCard.css'
import { useSelector } from 'react-redux'
import {Link, useParams} from 'react-router-dom';
import * as userApi from '../../api/userRequest.js'
const ProfileCard = ({location}) => {

  const {user} = useSelector((state)=>state.authReducer.authData);
  const posts = useSelector((state)=>state.postReducer.posts);
  const params = useParams();
  const link = "https://res.cloudinary.com/dvmweuskc/image/upload/v1717011612/posts/";

  const ProfilePage = false;
  const profileUserId = params.id;

  const [profileUser, setProfileuser] = useState({});
  const [following, setFollowing] = useState(0);
  const [followers, setFollowers] = useState(0);
  useEffect(()=>{
    const fetchProfileUser = async()=>{
      if(location ===  'profilePage'){
        if(profileUserId === user._id){
          setProfileuser(user);
          setFollowing(user.following.length);
          setFollowers(user.followers.length);
        }else{
          const profileUser = await userApi.getUser(profileUserId);
          setFollowing(profileUser.data.following.length);
          setFollowers(profileUser.data.followers.length);
          setProfileuser(profileUser.data);
        }
      }
    }
    fetchProfileUser();
  }, [user]);

  return (
    <div className='ProfileCard'>
      {location !==  'profilePage'? (
        <div className="ProfileImages">
          <img src={user.coverPicture? link+user.coverPicture : link+"1717080548872_4084071801.jpg"} alt="cover" />
          <img src={user.profilePicture? link+user.profilePicture : link + "defaultProfile_eza0ea.png" } alt="profile" />
        </div>
      ):(
        <div className="ProfileImages">
          <img src={profileUser.coverPicture? link+profileUser.coverPicture : link+"1717080548872_4084071801.jpg"} alt="cover" />
          <img src={profileUser.profilePicture? link+profileUser.profilePicture : link + "defaultProfile_eza0ea.png" } alt="profile" />
        </div>
      )
      }
      {location !==  'profilePage'? (
        <div className="ProfileName">
          <span>{user.firstname} {user.lastname}</span>
          <span>{user.worksAt? user.worksAt : "write about yourserf..."}</span>
        </div>
      ) : (
        <div className="ProfileName">
          <span>{profileUser.firstname} {profileUser.lastname}</span>
          <span>{profileUser.worksAt? profileUser.worksAt : "write about yourserf..."}</span>
        </div>

      )}
      <div className="followStatus">
        <hr />
        <div>
            
            <div className="follow">
                <span>{location !==  'profilePage'? (user.following.length) : following}</span>
                <span>Followings</span>
            </div>
            <div className="vl"></div>
            <div className="follow">
                <span>{location !==  'profilePage'? (user.followers.length) : followers}</span>
                <span>Followers</span>
            </div>
            {location === "profilePage" && (
            <>
              <div className="vl"></div>
              <div className="follow">
                <span>{posts.filter((post)=> post.userId === profileUser._id).length}</span>
                <span>Posts</span>
              </div>
            </>
          )}
        </div>
        <hr />
      </div>
      {location ===  'profilePage'? '' : (
          <span>
            <Link to ={`/profile/${user._id}`} style={{ textDecoration: "none", color: "inherit" }}>My Profile</Link>
          </span>
        )
      }
    </div>
  )
}

export default ProfileCard
