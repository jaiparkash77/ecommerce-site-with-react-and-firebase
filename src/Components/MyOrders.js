import React from 'react'
import { IndividualMyProduct } from './IndividualMyProduct'

export const MyOrders = ({myProducts}) => {
return(
    <IndividualMyProduct key={myProducts.ID} myProduct={myProducts} />
)
}
