import React, { useEffect, useState } from 'react'
import { Modal, useMantineTheme } from "@mantine/core";
import InputEmoji from 'react-input-emoji';
import './CommentModel.css'
import Comment from '../comment/Comment';
import { createReview, getAllReviews } from '../../api/reviewRequest';
import { useSelector } from 'react-redux';

const CommentModel = ({commentModelOpened, setCommentModelOpened, id, setCommnets}) => {
    const theme = useMantineTheme();
    const [newComment, setNewComment] = useState("");
    const [reviews, setReviews] = useState([]);

    const {user} = useSelector((state)=> state.authReducer.authData);

    const handleChange = (newComment)=>{
        setNewComment(newComment);
    }

    useEffect(()=>{
      const getReviews = async()=>{
        try {
          let allReview = await getAllReviews(id);
          setReviews(allReview.data);
          setCommnets(reviews.length);
        } catch (error) {
          console.log(error);
        }
        }
      getReviews();
    }, [commentModelOpened])

    const handelComment = async(e)=>{
      e.preventDefault();
      const comment = {
        comment: newComment,
        author: user._id
      }
      try {
        const {data} = await createReview(id, comment);
        setReviews([...reviews, data]);
        setNewComment("");
      } catch (error) {
        console.log(error);
      }
    }

  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="40%"
      opened={commentModelOpened}
      onClose={() => {setCommentModelOpened(false)}}
    >
        <div className="comment-menu" >
          <div className="comment-inp">
            <InputEmoji cleanOnEnter value={newComment} onChange={handleChange}/>
            <div className="button comment-btn" onClick={handelComment}>Comment</div>
          </div>
            <hr style={{border: "0.1px solid #ececec",width:'100%'}}/>
            <div className="comment-box">
                {reviews.length > 0 ? (
                    reviews.map((review, id)=>{
                        return <Comment review = {review} />
                    })
                    ):<span>No comments to show!</span>    
                }
            </div>
        </div>
    </Modal>
  )
}

export default CommentModel
