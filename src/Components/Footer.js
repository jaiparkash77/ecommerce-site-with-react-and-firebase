import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../Images/logo.png'
import { SocialMedia } from './SocialMedia'

export const Footer = ({user, totalProducts}) => {

  return (
    <div className='footer'>
            <div className='leftside'>
                <div className='logo'>
                    <img src={logo} alt="logo"/>
                </div>
            </div>
            <div className='rightside'>
                <div className='column1'>
                    <div><SocialMedia /></div>  
                </div>
                <div className='column2'>
                    <div><Link className='navlink' to={"/contact-us"}>Contact Us</Link></div>
                    <div><Link className='navlink' to={"/about-us"}>About Us</Link></div>
                </div>                                               
                <div className='column2'>
                    <div><Link className='navlink' to={"/terms-of-use"}>Terms of Use</Link></div> 
                    <div><Link className='navlink' to={"/faq"}>FAQ</Link></div> 
                </div>                                               
                                
            </div>
        </div>
  )
}
