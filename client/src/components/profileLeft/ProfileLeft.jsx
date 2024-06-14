import React from 'react'
import './ProfileLeft.css'
import LogoSearch from '../logoSearch/LogoSearch'
import FollowersCard from '../followersCard/FollowersCard'
import InfoCard from '../infoCard/InfoCard'
const ProfileLeft = () => {
  return (
    <div className='ProfileLeft'>
      <LogoSearch/>
      <InfoCard/>
      <FollowersCard/>
    </div>
  )
}

export default ProfileLeft
