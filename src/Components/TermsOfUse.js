import React,{useState, useEffect} from 'react'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import {auth,fs} from '../Config/Config'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc,onSnapshot, query} from 'firebase/firestore'

export const TermsOfUse = () => {
    // getting current user uid
  function GetUserUid(){
    const [uid,setUid]=useState(null);
    useEffect(()=>{
      auth.onAuthStateChanged(user=>{
        if(user){
          setUid(user.uid);
        }
      })
    },[])
    return uid;
  }

  const uid = GetUserUid();

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

  // state of TotalProducts
  const [totalProducts,setTotalProducts] = useState(0);

  // getting cart products
  useEffect(()=>{
    auth.onAuthStateChanged(user=>{
      if(user){
        const q = query(collection(fs, 'Cart '+ user.uid));
        onSnapshot(q, (querySnapshot) => {
          const qty = querySnapshot.docs.length;
          setTotalProducts(qty);
        }); 
      }
    })
  },[]);
  // console.log(totalProducts)
  return (
    <>
        <Navbar user={user} totalProducts={totalProducts} />
        <div  style={{padding:'20px'}}>
            <p>
                <b>Electronic E-Store Terms of Use</b>
                <br></br><br></br>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tempor lorem sed lorem consectetur volutpat. Phasellus vitae nisi turpis. Proin vel turpis lectus. Maecenas fermentum ipsum justo. Nullam a dapibus erat. Integer accumsan ipsum eget mi porttitor, vel varius tortor molestie. Maecenas porta ex in sodales mattis. Nunc velit nunc, vehicula convallis leo vel, pellentesque semper erat. Curabitur elementum posuere neque, quis feugiat diam luctus eu. Mauris in leo sed urna consectetur accumsan quis at dui.
                <br></br><br></br>
                Sed et nisi risus. Pellentesque et justo ligula. Aliquam vehicula bibendum ex quis blandit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent vel urna nulla. Nunc egestas egestas fringilla. Aliquam ac placerat ipsum. Nam varius fringilla metus et facilisis. Integer at sapien ac arcu feugiat imperdiet nec id nulla. Proin nec elit sed justo suscipit sagittis vitae nec libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquam interdum orci ac laoreet.
                <br></br><br></br>
                Nulla gravida dapibus felis consequat rutrum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla auctor urna at accumsan. Quisque purus odio, finibus sed libero in, scelerisque porttitor tellus. Nam quis placerat est. Pellentesque quis eros lorem. Nulla facilisi. Phasellus interdum augue lacus, vel sodales arcu tincidunt a. Proin sed gravida libero. Maecenas ultricies, orci et fermentum mattis, metus mi volutpat augue, hendrerit convallis tellus orci non tortor. Mauris hendrerit nisi vel lectus placerat, ut dictum magna molestie. Donec tincidunt pretium felis, eu pharetra elit feugiat sed. Donec at venenatis turpis, ac vulputate risus. Ut vitae consequat tortor, in elementum ante. Proin blandit pellentesque elementum.
                <br></br><br></br>
                Etiam fermentum ac nisl vitae malesuada. Mauris non interdum metus. Nunc tristique augue quis risus blandit ultricies. Aenean suscipit tempor quam eu blandit. Quisque sed urna tempus nulla ullamcorper commodo ac a augue. Aliquam molestie ullamcorper dolor, vitae ultrices leo lacinia a. Maecenas eget augue malesuada, eleifend quam ut, lobortis erat.
                <br></br><br></br>
                Nunc ultrices sem a tortor gravida pretium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at quam lobortis, fringilla est sed, hendrerit velit. Nulla ultricies, sapien quis bibendum bibendum, nulla metus eleifend urna, ac molestie risus sapien vitae lectus. Praesent sagittis posuere commodo. Praesent eget quam at metus ultrices molestie quis nec enim. Integer non convallis dolor. Aenean lobortis nunc mauris, sed auctor nisl scelerisque eget. Vivamus bibendum vel urna vel placerat.
            </p>
        </div>
        <Footer />
    </>
  )
}
