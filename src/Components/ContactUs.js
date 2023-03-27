import React,{useState, useEffect} from 'react'
import { Navbar } from './Navbar';
import {auth,fs} from '../Config/Config'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, onSnapshot, query,  addDoc} from 'firebase/firestore'

export const ContactUs = () => {

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
    
    const [name, setName]=useState('');
    const [email, setEmail]=useState('');
    const [message, setMessage]=useState('');
    const [phone, setPhone]=useState('');
    const [successMsg, setSuccessMsg]=useState('');
    const [uploadError, setUploadError]=useState('');

    const handleContactUs=(e)=>{
        e.preventDefault();
        // console.log(image);
        addDoc(collection(fs,'ContactUS'),{
            name,
            email,
            phone,
            message
        }).then(()=>{
            setSuccessMsg('Request sent successfully');
            setName('');
            setEmail('');
            setPhone('');            
            setTimeout(()=>{
                setSuccessMsg('');
            },3000);
        }).catch(error=>setUploadError(error.message));
    }
  return (
    <>
        <Navbar user={user} totalProducts={totalProducts} />    
        <div className='container'>
            <br></br>
            <br></br>
            <h1>Contact Us</h1>
            <hr></hr>        
            {successMsg&&<>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
            </>} 
            <form autoComplete="off" className='form-group' onSubmit={handleContactUs}>
                <label>Name</label>
                <input type="text" className='form-control' required onChange={(e)=>setName(e.target.value)} value={name}></input>
                <br></br>
                <label>Email</label>
                <input type="text" className='form-control' required onChange={(e)=>setEmail(e.target.value)} value={email}></input>
                <br></br>
                <label>Phone Number</label>
                <input type="number" className='form-control' required onChange={(e)=>setPhone(e.target.value)} value={phone}></input>
                <br></br>
                <label>Message</label>
                <input type="text" className='form-control' required onChange={(e)=>setMessage(e.target.value)} value={message}></input>            
                <br></br>           
                <div style={{display:'flex', justifyContent:'flex-end'}}>
                    <button type="submit" className='btn btn-success btn-md'>
                        SUBMIT
                    </button>
                </div>
            </form>
            {uploadError&&<>
                <br></br>
                <div className='error-msg'>{uploadError}</div>                
            </>}

        </div>
    </>
  )
}
