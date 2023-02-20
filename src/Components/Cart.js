import React, { useEffect, useState } from 'react'
import { auth, fs } from '../Config/Config';
import { onAuthStateChanged } from 'firebase/auth'
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc} from 'firebase/firestore'
import { Navbar } from './Navbar'
import { CartProducts } from './CartProducts';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { async } from '@firebase/util';

// toast.configure();

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

    // getting the qty from cartProducts in a saperate array
    const qty = cartProducts.map(cartProduct=>{
      return cartProduct.qty;
    })
    // console.log(qty);

    // reducing the qty in a single value using reducer
    const reducerOfQty = (accumulator,currentValue)=>accumulator+currentValue;

    const totalQty = qty.reduce(reducerOfQty,0);
    // console.log(totalQty)

    // getting the TotalProductPrice from cartProducts in a saperate array
    const price = cartProducts.map((cartProduct)=>{
      return cartProduct.TotalProductPrice;
    })

    // reducing the price in a single value
    const reducerOfPrice = (accumulator,currentValue)=>accumulator+currentValue;

    const totalPrice = price.reduce(reducerOfPrice,0);


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

  // charging payment
  const navigate = useNavigate();
  const handleToken = async(token)=>{
    // console.log(token);
    const cart = {name:'All Products', totalPrice};
    const response = await axios.post('http://localhost:8080/checkout',{
      token,
      cart
    })
    // console.log(response);
    // let {status} = response.data;
    // console.log(status)
    let status="success";
    if(status==="success"){
      navigate('/');
      // toast.success('Your order has been placed successfully', {
      //   position: 'top-right',
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: false,
      //   draggable: false,
      //   progress: undefined,
      // });
      const uid = auth.currentUser.uid;
      const carts = await getDocs(collection(fs,'Cart '+uid));
      carts.forEach(async(data)=>{
        var id = data.id;
        // console.log(id)
        await deleteDoc(doc(collection(fs,'Cart '+uid),id)).then(()=>{
          console.log('successfully');
        })            
      })    

    }else{
      alert("Something went worng in checkout");
    }
  }


 

  return (
    <>
        <Navbar user={user} totalProducts={totalProducts} />
        <br></br>
        {cartProducts.length>0 && (
            <div className='container-fluid'>
                <h1 className='text-center'>Cart</h1>
                <div className='products-box'>
                    <CartProducts cartProducts={cartProducts} cartProductIncrease={cartProductIncrease} cartProductDecrease={cartProductDecrease} />
                </div>
                <div className='summary-box'>
                    <h5>Cart Summary</h5>
                    <br></br>
                    <div>
                    Total No of Products: <span>{totalQty}</span>
                    </div>
                    <div>
                    Total Price to Pay: <span>$ {totalPrice}</span>
                    </div>
                    <br></br>
                    <StripeCheckout
                      stripeKey='pk_test_51MbMrQSI0Z5uKwXHcAFZtthSK9Vqec3mZRpbVxy3HnJcBtYolUCc5eMCZzSkifvs6uUAZlXGYfhTQjyQs4gZNra700DVfahwqf'
                      token={handleToken}
                      billingAddress
                      shippingAddress
                      name='All Products'
                      amount={totalPrice*100}
                    ></StripeCheckout>
                </div>
                <button onClick={delDoc}>Delete</button>
            </div>
        )}
        {cartProducts.length<1 && (
            <div className='container-fluid'>No products to show</div>
        )}
    </>
  )
}
