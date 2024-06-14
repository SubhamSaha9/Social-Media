import React, { useState } from 'react'
import './Auth.css'
import Logo from '../../img/logo.png'
import {useDispatch, useSelector} from 'react-redux';
import { logIn, signUp } from '../../actions/authAction';

const Auth = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.authReducer.loading);
  const [isSignUp, setIsSignUp] = useState(false);
  const [data, setData] = useState({firstname: "", lastname: "", username: "", password: "", confirmpass: "",});
  const [confirmPass, setConfirmPass] = useState(true);

  const handleChange = (e)=>{
    setData({...data, [e.target.name] : e.target.value});
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    if(isSignUp){
      data.password === data.confirmpass ? dispatch(signUp(data)) : setConfirmPass(false);
    }else{
      dispatch(logIn(data))
    }
  }

  const resetForm = ()=>{
    setConfirmPass(true);
    setData({firstname: "", lastname: "", username: "", password: "", confirmpass: "",});
  }

  return (
    <div className='Auth'>
      <div className="a-left">
        <img src={Logo} alt="logo" />
        <div className="webName">
            <h1>Subham.io Media</h1>
            <h6>Explore the ideas throughout the world</h6>
        </div>
      </div>

      <div className="a-right">
      <form className="infoForm authForm" onSubmit={handleSubmit}>
        <h3>{isSignUp? "Sign Up" : "Log In"}</h3>

        {isSignUp &&
          <div>
            <input
              type="text"
              placeholder="First Name"
              className="infoInput"
              name="firstname"
              value={data.firstname}
              onChange = {handleChange}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="infoInput"
              name="lastname"
              value={data.lastname}
              onChange = {handleChange}
            />
          </div>
        }

        <div>
          <input
            type="text"
            className="infoInput"
            name="username"
            placeholder="Usernames"
            value={data.username}
            onChange = {handleChange}
          />
        </div>

        <div>
          <input
            type="password"
            className="infoInput"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange = {handleChange}
          />
          {isSignUp && 
            <input
              type="password"
              className="infoInput"
              name="confirmpass"
              placeholder="Confirm Password"
              value={data.confirmpass}
              onChange = {handleChange}
            />
          }
        </div>
        <span
            style={{
              color: "red",
              fontSize: "12px",
              alignSelf: "flex-end",
              marginRight: "5px",
              display: confirmPass ? "none" : "block",
            }}
          >
            *Confirm password is not same
          </span>

        <div>
            <span style={{fontSize: '12px', cursor: 'pointer'}} onClick={() => {setIsSignUp((prev) => !prev);resetForm()}}>
              {isSignUp ? "Already have an account. Login!" : "Don't have an account Sign Up"}
            </span>
            <button className="button infoButton" type="submit" disabled={loading}>
              {loading ? "Loading..." : isSignUp ? "Signup" : "Log In"}
            </button>
        </div>
      </form>
    </div>
    </div>
  )
}

// function LogIn() {
//     return (
//       <div className="a-right">
//         <form className="infoForm authForm">
//           <h3>Log In</h3>
  
//           <div>
//             <input
//               type="text"
//               placeholder="Username"
//               className="infoInput"
//               name="username"
//             />
//           </div>
  
//           <div>
//             <input
//               type="password"
//               className="infoInput"
//               placeholder="Password"
//               name="password"
//             />
//           </div>
  
//           <div>
//               <span style={{ fontSize: "12px" }}>
//                 Don't have an account Sign up
//               </span>
//             <button className="button infoButton">Login</button>
//           </div>
//         </form>
//       </div>
//     );
// }

// function SignUp() {
//   return (
    
//   );
// }

export default Auth
