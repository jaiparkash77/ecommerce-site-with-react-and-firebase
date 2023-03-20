import React from 'react'

export const IndividualMyProduct = ({myProduct}) => {
    console.log(myProduct)
  return (
    <div className='product'>
        <div className='product-img'>
            <img src={myProduct.url} alt="product-img"/>
        </div>
        <div className='product-text title'>{myProduct.title}</div>
        <div className='product-text description'>{myProduct.description}</div>
        <div className='product-text price'>$ {myProduct.price}</div>        
        <div className='product-text cart-price'>$ {myProduct.TotalProductPrice}</div>           
    </div>
  )
}
