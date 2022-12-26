import React,{useState, useEffect} from 'react'
import { Navbar } from './Navbar'
import { Products } from './Products'
import {auth,fs} from '../Config/Config'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc} from 'firebase/firestore'

export const Home = () => {

  // getting current user function
  function GetCurrentUser(){
    const [user, setUser] = useState(null);
    useEffect(()=>{
      
      onAuthStateChanged(auth,(user)=>{
        if(user){
          const uid = user.uid;          
          const docRef = doc(collection(fs,'users'),uid);
          const docSnap = getDoc(docRef);          
          // docSnap.then((snapshot)=>console.log(snapshot.data().FullName));
          docSnap.then((snapshot)=>setUser(snapshot.data().FullName));
          
        }else{
          setUser(null);
        }
      })
    },[])
    return user;
  }

  const user = GetCurrentUser();
  // console.log(user)

  return (
    <>
        <Navbar user={user} />
        <Products />
    </>
  )
}
