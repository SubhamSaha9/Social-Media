import React, { useEffect, useState } from 'react'
import './Post.css'
import Comment from '../../img/comment.png'
import Share from '../../img/share.png'
import Heart from '../../img/like.png'
import NotLike from '../../img/notlike.png'
import { UilEllipsisV } from '@iconscout/react-unicons';

import { useSelector } from 'react-redux';
import { deletePost, likePost } from '../../api/postRequest'
import { getUser } from "../../api/userRequest";
import { format } from "timeago.js";
import {Link} from 'react-router-dom';
import UpdateModel from '../updateModel/UpdateModel'
import CommentModel from '../commentModel/CommentModel'
import { getAllReviews } from '../../api/reviewRequest'
import Swal from 'sweetalert2';

const Post = ({data}) => {
  const {user} = useSelector((state)=> state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length);
  const [comments, setCommnets] = useState(0);
  const [postOwner, setPostOwner] = useState({});
  const [visible, setVisible] = useState(false);
  const [modelOpened, setModelOpened] = useState(false);
  const [commentModelOpened, setCommentModelOpened] = useState(false);
  const [description, setDescription] = useState(data);
  const [validPost, setValidPost] = useState(true);

  useEffect(()=>{
     const getUserData = async () => {
      try {
        const owner = await getUser(data.userId);
        setPostOwner(owner.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, [])

  const handleLike = ()=>{
    setLiked((prev)=> !prev);
    likePost(data._id, user._id);
    liked? setLikes((prev)=> prev-1) : setLikes((prev)=> prev+1);
  }

  const handleVisible = ()=>{
    setVisible(!visible);
  }

  const handleDelete = async()=>{
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async(result) => {
      if (result.isConfirmed) {
        try {
          if(user._id === description.userId){
            await deletePost(data._id, user);
            setVisible(false);
            setValidPost(false);
            Swal.fire({
            title: "Deleted!",
            text: "Post has been deleted.",
            icon: "success"
          });
          }else{
            setModelOpened(true);
          }
        } catch (error) {
          console.log(error);
          Swal.fire({
          title: "Error!",
          text: "An error occured whhile deletion.",
          icon: "error"
          });
        }
        
      }
    });
  }

  useEffect(()=>{
      const getReviews = async()=>{
        try {
          let allReview = await getAllReviews(data._id);
          setCommnets(allReview.data.length);
        } catch (error) {
          console.log(error);
        }
        }
      getReviews();
    }, [])

  const link = "https://res.cloudinary.com/dvmweuskc/image/upload/v1717011612/posts/";

  return (
    <>
      {validPost ? (
        <div className='Post'>
      <div className='postOwner' >
        <div className="onner-details">
            <img src={postOwner.profilePicture? link+postOwner.profilePicture : link + "defaultProfile_eza0ea.png" } alt="img" />
            <Link to = {`/profile/${postOwner._id}`} style={{textDecoration: "none"}}>
              <div >
                  <span><b style={{fontSize: "1rem"}}>{postOwner.firstname} {postOwner.lastname}</b></span>
                  <span style={{fontSize: "12px"}}>{format(description.createdAt)}</span>
              </div>
            </Link>
        </div>
        <div className='pop-menu'>
          <UilEllipsisV style={{cursor: 'pointer'}} onClick={handleVisible}/>
          {visible? (
            <div className="popover">
              <div>
                <div onClick={()=>setModelOpened(true)}>Update Post</div>
                < UpdateModel modelOpened={modelOpened} setModelOpened={setModelOpened} setVisible={setVisible} setDescription={setDescription} data = {description}/>
              </div>
              <div onClick={handleDelete}>Delete Post</div>
            </div>
          ) : ''}
        </div>
      </div>
        {description.image && 
          <img src={description.image ? link+description.image : ""} alt="img" />
        }
        <div className="details">
            <span> {description.desc}</span>
        </div>
        <div className="postReact">
            <img src={liked? Heart : NotLike} alt="like" style={{cursor: "pointer"}} onClick={handleLike}/>
            <div>
              <img src={Comment} alt="comment" style={{cursor:"pointer"}} onClick={()=>setCommentModelOpened(true)} />
              <CommentModel commentModelOpened={commentModelOpened} setCommentModelOpened={setCommentModelOpened} id ={data._id} setCommnets={setCommnets}/>
            </div>
            <img src={Share} alt="share" />
        </div>
        <div style={{display:'flex', gap:'1rem'}} className='data-counts'>
          <span><div>{likes}</div> <div>likes</div></span>
        <span><div>{comments}</div> <div>comments</div></span>
        </div>
        
    </div>
      ) : ""}
    </>
  )
}

export default Post