import React,{useState, useEffect} from 'react'
import { Navbar } from './Navbar'
import { Products } from './Products'
import {auth,fs} from '../Config/Config'
import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, getDocs} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export const Home = () => {

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
  // console.log(user)

  // state of products
  const [products, setProducts] = useState([]);

  // getting products function
  const getProducts = async ()=>{
    const productsArray = [];
    
    const querySnapshot = await getDocs(collection(fs, "Products"));
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
      // console.log(doc.data())
      var data = doc.data();
      data.ID = doc.id;
      productsArray.push({
        ...data
      })
      if(productsArray.length === querySnapshot.docs.length){
        setProducts(productsArray);
      }
    });
  }


  useEffect(()=>{
    getProducts();
  },[])

  const navigate = useNavigate();
  let Product;
  const addToCart =(product)=>{
    if(uid !== null){
      // console.log(product)
      Product = product;
      Product['qty'] = 1;
      Product['TotalProductPrice'] = Product.qty*Product.price;
      // addDoc(fs,'Cart'+uid,Product).then(()=>{
      //   console.log("success");
      // })
      addDoc(collection(fs,'Cart ' + uid),Product).then(()=>{
        console.log("success");
      })
    }else{
      navigate('/login');
    }
  }

  return (
    <>
        <Navbar user={user} />
        <br></br>
        {products.length>0 && (
          <div className='container-fluid'>
            <h1 className='text-center'>Products</h1>
            <div className='products-box'>
              <Products products={products} addToCart={addToCart} />
            </div>
          </div>
        )}
        {products.length<1 &&(
          <div className='container-fluid'>Please wait....</div>
        )}
    </>
  )
}
