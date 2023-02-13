import React, { useEffect, useState } from 'react'
import { auth, fs } from '../Config/Config';
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, onSnapshot, query, setDoc} from 'firebase/firestore'
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
      auth.onAuthStateChanged(user=>{
          if(user){
              const q = query(collection(fs, 'Cart '+ user.uid));
              onSnapshot(q, (querySnapshot) => {
                const cities = [];
                querySnapshot.forEach((doc) => {
                    cities.push(doc.data());
                });
                // cities.map((a)=>console.log(a));
                const newCartProduct = cities.map((a)=>({
                  ID: a.ID,
                  ...a
                }));
                setCartProducts(newCartProduct);
              });              
              
          }else{
              console.log("user is not signed in to retrieve cart");
          }
      })
    },[])

    // console.log(cartProducts);

    // global variable
    let Product;

    // cart product increase function
    const cartProductIncrease = (cartProduct)=>{
    // console.log(cartProduct)
    Product = cartProduct;
    Product.qty = Product.qty+1;
    Product.TotalProductPrice = Product.qty*Product.price;
    // updating in database  
    auth.onAuthStateChanged(user=>{
      if(user){          
          setDoc(doc(collection(fs,'Cart '+ user.uid),cartProduct.ID),Product).then(()=>{
            console.log('increment added');
          })
      }else{
        console.log("User is not logged in to increment");
      }
    })
  }

  // cart product decrease function
  const cartProductDecrease = (cartProduct)=>{
    // console.log(cartProduct)
    Product = cartProduct;
    if(Product.qty>1){
      Product.qty = Product.qty-1;
      Product.TotalProductPrice = Product.qty*Product.price;
      // updating in database  
      auth.onAuthStateChanged(user=>{
        if(user){          
            setDoc(doc(collection(fs,'Cart '+ user.uid),cartProduct.ID),Product).then(()=>{
              console.log('decrement');
            })
        }else{
          console.log("User is not logged in to decrement");
        }
      })
    }
  }

  return (
    <>
        <Navbar user={user} />
        <br></br>
        {cartProducts.length>0 && (
            <div className='container-fluid'>
                <h1 className='text-center'>Cart</h1>
                <div className='products-box'>
                    <CartProducts cartProducts={cartProducts} cartProductIncrease={cartProductIncrease} cartProductDecrease={cartProductDecrease} />
                </div>
            </div>
        )}
        {cartProducts.length<1 && (
            <div className='container-fluid'>No products to show</div>
        )}
    </>
  )
}
