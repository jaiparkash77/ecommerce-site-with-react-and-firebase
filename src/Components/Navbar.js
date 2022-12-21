import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <div>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Login</Link>
    </div>
  )
}
