import React, { useEffect, useState } from 'react'
import { auth, fs } from '../Config/Config';
import { onAuthStateChanged } from 'firebase/auth'
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc} from 'firebase/firestore'
import { Navbar } from './Navbar'
import { MyOrders } from './MyOrders';

export const Orders = () => {
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
    const [myProducts, setMyProducts] = useState([]);

    // getting cart products from firestore collection and updating the state
    useEffect(()=>{
      auth.onAuthStateChanged(user=>{
          if(user){
              const q = query(collection(fs, 'Buyer-Cart '+ user.uid));
              onSnapshot(q, (querySnapshot) => {
                const products = [];
                querySnapshot.forEach((doc) => {
                    products.push(doc.data());
                });
                // products.map((a)=>console.log(a));
                const newCartProduct = products.map((a)=>({
                  ID: a.ID,
                  ...a
                }));
                setMyProducts(newCartProduct);
              });              
              
          }else{
              console.log("user is not signed in to retrieve cart");
          }
      })
    },[])

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
  // console.log(myProducts)

  return (
    <>
        <Navbar user={user} totalProducts={totalProducts} />
        <br></br>
        {myProducts.length>0 && (
            <div className='container-fluid'>
                <h1 className='text-center'>My Orders</h1>
                <div className='products-box cart'>
                    {
                        myProducts.map((myProducts)=>(
                            <MyOrders key={myProducts.ID} myProducts={myProducts} />
                          ))
                    }
                </div>
            </div>
        )}
        {myProducts.length<1 && (
            <div className='container-fluid'>No products to show</div>
        )}
    </>
  )
}
