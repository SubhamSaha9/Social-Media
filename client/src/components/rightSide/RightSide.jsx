import React, { useState } from 'react'
import './RightSide.css'
import TrendCard from '../trendCard/TrendCard';
import ShareModel from '../shareModel/ShareModel';
import NavIcons from '../navIcons/NavIcons';
const RightSide = () => {

  const [modelOpened, setModelOpened] = useState(false);

  return (
    <div className='RightSide'>
      <NavIcons/>
      <TrendCard/>
      <button className='button r-button' onClick={()=>setModelOpened(true)}>
        Share
      </button>
      <ShareModel modelOpened={modelOpened} setModelOpened={setModelOpened}/>
    </div>
  )
}

export default RightSide
