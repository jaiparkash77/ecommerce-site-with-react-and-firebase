import React,{useState, useEffect} from 'react'
import { Navbar } from './Navbar'
import { Products } from './Products'
import {auth,fs} from '../Config/Config'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { IndividualFilteredProduct } from './IndividualFilteredProduct'
import { Footer } from './Footer'

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
  },[]);

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

  const navigate = useNavigate();
  let Product;
  const addToCart =(product)=>{
    if(uid !== null){
      // console.log(product)
      Product = product;
      Product['qty'] = 1;
      Product['TotalProductPrice'] = Product.qty*Product.price;
      
      // addDoc(collection(fs,'Cart ' + uid),Product).then(()=>{
      //   console.log("success");
      // })
      const docRef = doc(collection(fs,'Cart ' + uid),Product.ID);
      setDoc(docRef,Product).then(()=>{
        console.log("success");
      })
    }else{
      navigate('/login');
    }
  }

  // categories list rendering using span tag
  const [spans]=useState([
    {id: 'ElectronicDevices', text: 'Electronic Devices'},
    {id: 'MobileAccessories', text: 'Mobile Accessories'},
    {id: 'TVAndHomeAppliances', text: 'TV & Home Appliances'},
    {id: 'CameraAndAccessories', text: 'Camera & Accessories'},
    {id: 'LaptopAccessories', text: 'Laptop Accessories'},
    {id: 'Powerbank', text: 'Powerbank'},
    {id: 'SmartWearables', text: `Smart Wearables`},
    {id: 'Storage', text: `Storage`},
    {id: 'Tablets', text: 'Tablets'},             
  ])

  // filtered product state
  const [filteredProducts,setFilteredProducts] = useState([]);

  // active class state
  const [active, setActive]=useState('');

  // category state
  const [category, setCategory]=useState('');

  // handle change ... it will set category and active states
  const handleChange=(individualSpan)=>{
    setActive(individualSpan.id);
    setCategory(individualSpan.text);
    filterFunction(individualSpan.text);
  }

  // filter function
  const filterFunction=(text)=>{
    const filter = products.filter((product)=>product.category===text);
    setFilteredProducts(filter);
  }

  // return to all products
  const returntoAllProducts=()=>{
    setActive('');
    setCategory('');
    setFilteredProducts([]);
  }

  return (
    <>
        <Navbar user={user} totalProducts={totalProducts} />
        <br></br>
        <div className='container-fluid filter-products-main-box'>
          <div className='filter-box'>
            <h6>Filter by category</h6>
            {spans.map((individualSpan,index)=>(
                <span key={index} id={individualSpan.id} onClick={()=>handleChange(individualSpan)} className={individualSpan.id===active ? active:'deactive'}>{individualSpan.text}</span>
            ))}
          </div>
          {filteredProducts.length>0 &&(
            <div className='my-products'>
              <h1 className='text-center'>{category}</h1>
              <button onClick={returntoAllProducts}>Return to All Products</button>
              {/* <a href="javascript:void(0)" onClick={returntoAllProducts}>Return to All Products</a> */}
              <div className='products-box'>
                {filteredProducts.map(individualFilteredProduct=>(
                  <IndividualFilteredProduct key={individualFilteredProduct.ID} individualFilteredProduct={individualFilteredProduct} addToCart={addToCart} />
                ))}
              </div>
            </div>
          )}
          {filteredProducts.length<1 &&(
            <>
              {products.length>0&&(
                <div className='my-products'>
                  <h1 className='text-center'>All Products</h1>
                  <div className='products-box'>
                    <Products products={products} addToCart={addToCart} />
                  </div>
                </div>
              )}
              {products.length<1 &&(
                <div className='my-products please-wait'>Please wait...</div>
              )}
            </>
          )}
        </div>        
        <Footer />
    </>
  )
}
