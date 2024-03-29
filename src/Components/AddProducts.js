import { addDoc, collection, doc, getDoc, onSnapshot, query} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React,{useState, useEffect} from 'react';
import { storage, fs, auth,} from '../Config/Config';
import { Navbar } from './Navbar';
import { onAuthStateChanged } from 'firebase/auth'

export const AddProducts = () => {
    
    const [title, setTitle]=useState('');
    const [description, setDescription]=useState('');
    const [price, setPrice]=useState('');
    const [category, setCategory]=useState('');
    const [image, setImage]=useState(null);

    const [imageError, setImageError]=useState('');
    
    const [successMsg, setSuccessMsg]=useState('');
    const [uploadError, setUploadError]=useState('');

    const types =['image/jpg','image/jpeg','image/png','image/PNG'];
    const handleProductImg=(e)=>{
        let selectedFile = e.target.files[0];
        if(selectedFile){
            if(selectedFile&&types.includes(selectedFile.type)){
                setImage(selectedFile);
                setImageError('');
            }
            else{
                setImage(null);
                setImageError('please select a valid image file type (png or jpg)')
            }
        }
        else{
            console.log('please select your file');
        }
    }

    const handleAddProducts=(e)=>{
        e.preventDefault();
        // console.log(title, description, price);
        // console.log(image);
        const storageRef = ref(storage,`product-images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef,image);
        uploadTask.on('state_changed',(snapshot)=>{
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        },error=>setUploadError(error.message),()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((url)=>{
                // console.log(url);
                addDoc(collection(fs,'Products'),{
                    title,
                    description,
                    category,
                    price: Number(price),
                    url
                }).then(()=>{
                    setSuccessMsg('Product added successfully');
                    setTitle('');
                    setDescription('');
                    setCategory('');
                    setPrice('');
                    document.getElementById('file').value = '';
                    setImageError('');
                    setUploadError('');
                    setTimeout(()=>{
                        setSuccessMsg('');
                    },3000);
                }).catch(error=>setUploadError(error.message));
            })
        })
    }

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
        <Navbar  user={user} totalProducts={totalProducts} /> 
    
        <div className='container'>
            <br></br>
            <br></br>
            <h1>Add Products</h1>
            <hr></hr>        
            {successMsg&&<>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
            </>} 
            <form autoComplete="off" className='form-group' onSubmit={handleAddProducts}>
                <label>Product Title</label>
                <input type="text" className='form-control' required onChange={(e)=>setTitle(e.target.value)} value={title}></input>
                <br></br>
                <label>Product Description</label>
                <input type="text" className='form-control' required onChange={(e)=>setDescription(e.target.value)} value={description}></input>
                <br></br>
                <label>Product Price</label>
                <input type="number" className='form-control' required onChange={(e)=>setPrice(e.target.value)} value={price}></input>
                <br></br>
                <label>Product Category</label>
                <select className='form-control' required value={category} onChange={(e)=>setCategory(e.target.value)}>                                    
                    <option value="">Select Product Category</option>                   
                    <option>Electronic Devices</option>
                    <option>Mobile Accessories</option>
                    <option>TV & Home Appliances</option>
                    <option>Camera & Accessories</option>
                    <option>Laptop Accessories</option>
                    <option>Powerbank</option>
                    <option>Smart Wearables</option>
                    <option>Storage</option>
                    <option>Tablets</option>
                </select>
                <br></br>
                <label>Upload Product Image</label>
                <input type="file" id="file" className='form-control' required onChange={handleProductImg}></input>
                
                {imageError&&<>
                    <br></br>
                    <div className='error-msg'>{imageError}</div>
                    
                </>}
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
