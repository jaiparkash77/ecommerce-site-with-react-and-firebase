import React,{useState, useEffect} from 'react'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import {auth,fs} from '../Config/Config'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, onSnapshot, query} from 'firebase/firestore'

export const AboutUs = () => {
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
        <div style={{padding:'20px'}}>
            <h1>About Us</h1>
            <p>
                <b>What is Lorem Ipsum?</b>
                <br></br><br></br>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                <br></br><br></br>
                <b>Why do we use it?</b>
                <br></br><br></br>
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                <br></br><br></br>
                <b>Where does it come from?</b>
                <br></br><br></br>
                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
                <br></br><br></br>
                The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
                <br></br><br></br>
                <b>Where can I get some?</b>
                <br></br><br></br>
                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.

            </p>
        </div>
        <Footer />
    </>
  )
}
