import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useState } from 'react'
import { auth, fs } from '../Config/Config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Modal = ({TotalPrice,totalQty, hideModal}) => {
  // form states
  const [cell, setCell]=useState(null);
  const [residentialAddress, setResidentialAddress]=useState('');
  const [cartPrice]=useState(TotalPrice);
  const [cartQty]=useState(totalQty);

//   close modal
const handleCloseModal=()=>{
    hideModal();
}

//   cash on delivery
const handleCashOnDelivery=async(e)=>{
    e.preventDefault();
    toast('Your order has been placed successfully', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
    });
    // console.log(cell, residentialAddress, cartPrice, cartQty);
    const uid = auth.currentUser.uid;
    const userRef = await doc(collection(fs,'users'),uid);
    const getUserData = getDoc(userRef);
    getUserData.then(async(userData)=>{
        await addDoc(collection(fs,'Buyer-Personal-Info'),{
            Name: userData.data().FullName,
            Email: userData.data().Email,
            CellNo: cell,
            ResidentialAddress: residentialAddress,
            CartPrice: cartPrice,
            CartQty: cartQty
        })
    })

    const cartData = await getDocs(collection(fs,'Cart '+uid));
    for(var snap of cartData.docs){
        var data = snap.data();
        data.ID = snap.id;
        await addDoc(collection(fs,'Buyer-Cart '+uid),data);
        await deleteDoc(doc(collection(fs,'Cart '+uid),snap.id)).then(()=>{
            console.log('Successfully placed order');
        })
    }
    hideModal();
    
}

  return (
    <div className='shade-area'>
        <div className='modal-container'>
            <form className='form-group' onSubmit={handleCashOnDelivery}>                   
                <input type="number" className='form-control' placeholder='Cell No'
                    required onChange={(e)=>setCell(e.target.value)} value={cell}                        
                />
                <br></br>
                <input type="text" className='form-control' placeholder='Residential Address'
                    required onChange={(e)=>setResidentialAddress(e.target.value)}
                    value={residentialAddress}
                />
                <br></br>
                <label>Total Quantity</label>
                <input type="text" className='form-control' readOnly
                    required value={cartQty}
                />
                <br></br>
                <label>Total Price</label>
                <input type="text" className='form-control' readOnly
                    required value={cartPrice}
                />
                <br></br>
                <button type='submit' className='btn btn-success btn-md'>Submit</button>
            </form>
            <div className='delete-icon' onClick={handleCloseModal}>x</div>
        </div>
        <ToastContainer />
    </div>
  )
}
