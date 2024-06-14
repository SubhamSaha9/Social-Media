import React, { useEffect, useState } from 'react'
import './InfoCard.css'
import {UilPen} from '@iconscout/react-unicons'
import ProfileModel from '../profileModel/ProfileModel';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as userApi from '../../api/userRequest.js'
import { logOut } from '../../actions/authAction.js';

const InfoCard = () => {

  const dispatch = useDispatch();
  const params = useParams()


  const [modelOpened, setModelOpened] = useState(false);
  const profileUserId = params.id;
  const [profileUser, setProfileuser] = useState({});

  const {user} = useSelector((state)=>state.authReducer.authData);

  useEffect(()=>{
    const fetchProfileUser = async()=>{
      if(profileUserId === user._id){
        setProfileuser(user);
      }else{
        const profileUser = await userApi.getUser(profileUserId);
        console.log(profileUser)
        setProfileuser(profileUser.data);
      }
    }
    fetchProfileUser();
  }, [user]);

  const handleLogout = ()=>{
    dispatch(logOut());
  }

  return (
    <div className='InfoCard'>
      <div className="infoHead">
        <h4>Profile Info</h4>
        {user._id === profileUserId ? (
          <div>
              <UilPen width='2rem' height='1.2rem' onClick={()=>setModelOpened(true)}/>
              <ProfileModel modelOpened={modelOpened} setModelOpened={setModelOpened} data = {user}/>
          </div>
        ) : ""}
      </div>
      <div className="info">
        <span>
            <b>Status </b>
        </span>
        <span>{profileUser.relationship}</span>
      </div>
      <div className="info">
        <span>
            <b>Lives in </b>
        </span>
        <span>{profileUser.livesin}</span>
      </div>
      <div className="info">
        <span>
            <b>Works at </b>
        </span>
        <span>{profileUser.worksAt}</span>
      </div>
      <button className='button logout-button' onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default InfoCard
