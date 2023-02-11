import React, { useEffect, useState } from 'react'
import { auth, fs } from '../Config/Config';
import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, getDocs} from 'firebase/firestore'
import { Navbar } from './Navbar'
import { CartProducts } from './CartProducts';

export const Cart = () => {

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

  // state of cart products
  const [cartProducts, setCartProducts] = useState([]);

  // getting cart products from firestore collection and updating the state
  useEffect(()=>{
    const productsArray = [];
    auth.onAuthStateChanged(user=>{
        if(user){
            const querySnapshot = getDocs(collection(fs,'Cart '+ user.uid));
            // querySnapshot.then((doc)=>doc.forEach((d)=>console.log(d.data())));
            querySnapshot.then((doc)=>doc.forEach((d)=>{
                productsArray.push({
                    ID:d.id,
                    ...d.data(),
                  })
            }));
            setCartProducts(productsArray);
            
            
        }else{
            console.log("user is not signed in to retrieve cart");
        }
    })
  },[])

//   console.log(cartProducts);

  return (
    <>
        <Navbar user={user} />
        <br></br>
        {cartProducts.length>0 && (
            <div className='container-fluid'>
                <h1 className='text-center'>Cart</h1>
                <div className='products-box'>
                    <CartProducts cartProducts={cartProducts} />
                </div>
            </div>
        )}
        {cartProducts.length<1 && (
            <div className='container-fluid'>No products to show</div>
        )}
    </>
  )
}
