import React, {useState, useRef} from 'react'
import './PostShare.css'
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage, uploadPost } from '../../actions/uploadAction';
import Swal from 'sweetalert2';
const PostShare = () => {
    const [image, setImage] = useState(null);
    const imageRef = useRef();
    const desc = useRef()
    const dispatch = useDispatch()
    const {user} = useSelector((state)=>state.authReducer.authData);
    const loading = useSelector((state) => state.postReducer.uploading);
    const link = "https://res.cloudinary.com/dvmweuskc/image/upload/v1717011612/posts/";

    const onImageChange = (event) =>{
        if(event.target.files && event.target.files[0]){
            let img = event.target.files[0];
            setImage(img);
        }
    }

    const reset = ()=>{
        setImage(null);
        desc.current.value = "";
    }


    const handleSubmit = (e)=>{
        e.preventDefault();
        const newPost = {
            userId : user._id,
            desc: desc.current.value,
        }

        if(image){
            const data = new FormData();
            const fileName = Date.now() +'_'+ Math.floor(1000000000 + Math.random() * 9000000000);
            data.append("name", fileName);
            data.append("file", image);
            newPost.image = fileName + '.' + image.name.split('.').pop();
            try {
                dispatch(uploadImage(data))
            } catch (error) {
                console.log(error)
            }
        }
        dispatch(uploadPost(newPost));
        setTimeout(()=>{
            reset();
            window.location.reload();
        },3000);
        Swal.fire({
            title: "Uploading post...",
            html: "please wait the page will refresh soon!",
            timer: 2910,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log("I was closed by the timer");
            }
        });
    }

  return (
    <div className='PostShare'>
      <img src={user.profilePicture? link+user.profilePicture : link + "defaultProfile_eza0ea.png"} alt="profileImage" />
      <div>
        <input type="text" placeholder="What's happening" ref={desc} required/>
        <div className="postOptions">
            <div className="option" style={{ color: "var(--photo)" }} onClick={()=>imageRef.current.click()}>
                <UilScenery />
                Photo
            </div>
            <div className="option" style={{ color: "var(--video)" }}>
                <UilPlayCircle />
                Video
            </div>
            <div className="option" style={{ color: "var(--location)" }}>
                <UilLocationPoint />
                Location
            </div>
            <div className="option" style={{ color: "var(--schedule)" }}>
                <UilSchedule />
                Schedule
            </div>
            <button className="button ps-button" onClick={handleSubmit} disabled={loading}>{loading? "Uploading...":"Share"}</button>
            <div style={{ display: "none" }}>
                <input type="file" accept="image/*"  name="myImage" ref={imageRef} onChange={onImageChange} />
            </div>
        </div>
        {image && (
            <div className="previewImage">
                <UilTimes onClick={()=>setImage(null)}/>
                <img src={URL.createObjectURL(image)} alt="img" />
            </div>
        )}
      </div>
    </div>
  )
}

export default PostShare
