import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import {auth,fs} from '../Config/Config'
import { useNavigate } from 'react-router-dom'

export const Signup = () => {

  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignup = (e)=>{
    e.preventDefault();
    createUserWithEmailAndPassword(auth,email,password).then((credentials)=>{
      // console.log(credentials);

      const usersRef = doc(collection(fs,"users"),credentials.user.uid);
      const data = {
          FullName: fullName,
          Email: email,
          Password: password
        }
      setDoc(usersRef,data).then(()=>{
          setSuccessMsg("Signup Successfull. You will now automatically get redirected to Login");
          setFullName('');
          setEmail('');
          setPassword('');
          setErrorMsg('');
  
          setTimeout(()=>{
            setSuccessMsg('');
            navigate("/login");
          },3000)
        }).catch((error)=>{
          setErrorMsg(error.message)
      });
      
    }).catch((error)=>{
      setErrorMsg(error.message)
    })
  }

  return (
    <div className='container'>
        <br></br>
        <br></br>
        <h1>Sign Up</h1>
        <hr></hr>
        {successMsg && <>
          <div className='success-msg'>{successMsg}</div>
          <br></br>
        </>}
        <form className='form-group' autoComplete='off' onSubmit={handleSignup}>
            <label>Full Name</label>
            <input type="text" className='form-control' placeholder='Full Name' required onChange={(e)=> setFullName(e.target.value)} value={fullName} ></input>
            <br></br>
            <label>Email</label>
            <input type="email" className='form-control' placeholder='Email' required onChange={(e)=> setEmail(e.target.value)} value={email} ></input>
            <br></br>
            <label>Password</label>
            <input type="password" className='form-control' placeholder='Password' required onChange={(e)=> setPassword(e.target.value)} value={password} ></input>
            <br></br>
            <div className='btn-box'>
              <span>Already have an account Login <Link to="/login" className='link'>Here</Link></span>
              <button type='submit' className='btn btn-success btn-md'>SIGN UP</button>
            </div>
        </form>
        {errorMsg && <>
          <br></br>
          <div className='error-msg'>{errorMsg}</div>
        </>}
    </div>
  )
}

// Register Auth in Authentication - https://firebase.google.com/docs/auth/web/start
// Register user in firestore -  https://firebase.google.com/docs/firestore/manage-data/add-data