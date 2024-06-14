import React, { useState } from 'react'
import './Comment.css'
import {Link} from 'react-router-dom';
import { format } from 'timeago.js';
import { UilCommentEdit } from '@iconscout/react-unicons';
import { UilTrash } from '@iconscout/react-unicons';
import { UilCornerUpLeftAlt } from '@iconscout/react-unicons';
import { useSelector } from 'react-redux';
import InputEmoji from 'react-input-emoji';
import Swal from 'sweetalert2';
import { deleteReview, updateReview } from '../../api/reviewRequest';
const Comment = ({review}) => {
  const {user} = useSelector((state)=> state.authReducer.authData);
  const [visible, setVisible]= useState(false);
  const [replyBox, setReplyBox]= useState(false);
  const [newComment, setNewComment] = useState(review.comment);
  const [validReview, setValidReview] = useState(true);
  const link = "https://res.cloudinary.com/dvmweuskc/image/upload/v1717011612/posts/";

  const handleChange = (newComment)=>{
      setNewComment(newComment);
  }
  const handleUpdate = async(e)=>{
    e.preventDefault();
    const updatedReview = {
      comment: newComment,
      userId: user._id
    }
    try {
      await updateReview(review.postId, review._id, updatedReview);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Comment updated successfully"
      });
      setVisible(false);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async(e)=>{
    e.preventDefault();
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
          await deleteReview(review.postId, review._id, user);
          setValidReview(false);
          Swal.fire({
          title: "Deleted!",
          text: "Your comment has been deleted.",
          icon: "success"
          });
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

  return (
    <>
      {validReview ? (
        <>
          <div className='Comment'>
            <img src={review.author.profilePicture? link + review.author.profilePicture : link + "defaultProfile_eza0ea.png"} alt="img" />
          <div className="details">
            <div >
                <Link to = {`/profile/${review?.author?._id}`} style={{textDecoration: "none", color:"black"}}>
                    <b style={{fontSize: "0.9rem"}}>{review?.author?.firstname} {review?.author?.lastname}</b>
                </Link>
                <div >{visible? (
                  <>
                    <div style={{display:'flex', minWidth:'20rem'}}>
                      <InputEmoji value={newComment} onChange={handleChange} />
                      <div className="button update-btn" onClick={handleUpdate}>Update</div>
                    </div>
                  </>
                ): newComment}</div>
            </div>
            <div className="control-panel">
              <div style={{opacity:'1', fontSize: '0.7rem'}}>{format(review.createdAt)}</div>
              <div className='icons'><UilCornerUpLeftAlt style={{height:'20'}} onClick={()=>setReplyBox(!replyBox)}/></div>
              {user._id === review.author._id ? (
                <>
                  <div className='icons' onClick={()=>setVisible(true)}><UilCommentEdit style={{height:'20'}}/></div>
                  <div className='icons' onClick={handleDelete}><UilTrash style={{height:'20'}}/></div>
                </>
              ): ""}
            </div>
            {replyBox ? (
              <div className="reply-box">
                <InputEmoji />
                <div className="button update-btn" >Reply</div>
            </div>
            ) : ""}
          </div>
        </div>
        </>
      ): ""}
    </>
  )
}

export default Comment
