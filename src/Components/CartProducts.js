import React from 'react'
import { IndividualCartProduct } from './IndividualCartProduct'

export const CartProducts = ({cartProducts}) => {
    // console.log(cartProducts)
    
  return cartProducts.map((cartProduct)=>(
    <IndividualCartProduct key={cartProduct.ID} cartProduct={cartProduct} />
  ))
}
