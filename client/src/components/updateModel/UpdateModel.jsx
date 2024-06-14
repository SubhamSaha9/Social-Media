import React, { useState } from 'react'
import { Modal, useMantineTheme } from "@mantine/core";
import './UpdateModel.css'
import {  useSelector } from 'react-redux';
import { updatePost } from '../../api/postRequest';
import Swal from 'sweetalert2';

const UpdateModel = ({modelOpened, setModelOpened, setVisible,setDescription, data}) => {
    const theme = useMantineTheme();
    const link = "https://res.cloudinary.com/dvmweuskc/image/upload/v1717011612/posts/";
    const [formData, setFormData] = useState(data);
    const {user} = useSelector((state)=>state.authReducer.authData);

    const handleChange = (e)=>{
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const desc = formData;
        console.log(formData)
        try {
            await updatePost(data._id, desc);
            setDescription(desc);
            setModelOpened(false);
            setVisible(false);
            const Toast = Swal.mixin({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "Post updated successfully"
            });
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
      size="55%"
      opened={modelOpened}
      onClose={() => {
            setModelOpened(false);
            if(user._id !== data.userId){
                setVisible(false)
            }
        }}
    >
        {user._id === data.userId ? (
            <div className="UpdateModel">
            {data.image && 
                <img src={data.image ? link+data.image : ""} alt="img" />
            }
            
                <form>
                    <input type="text" className="desc" name="desc" placeholder="Enter description..." onChange={handleChange} value={formData.desc}/>
                    <button className='button update-btn' onClick={handleSubmit}>Update</button>
                </form>
            
        </div>
        ) : (
            <h2 className='alert'>You are not the user!</h2>
        )}
    </Modal>
  )
}

export default UpdateModel
