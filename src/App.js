import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './Components/Home';
import { Signup } from './Components/Signup';
import { Login } from './Components/Login';
import { NotFound } from './Components/NotFound';
import { AddProducts } from './Components/AddProducts';
import { Cart } from './Components/Cart';
import { Orders } from './Components/Orders';
import { ContactUs } from './Components/ContactUs';
import { AboutUs } from './Components/AboutUs';
import { TermsOfUse } from './Components/TermsOfUse';
import { Faq } from './Components/Faq';
import KommunicateChat from './chat'

function App() {
  return (
    <>
    
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/signup' element={<Signup />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/add-products' element={<AddProducts />}/>
            <Route path='/cart' element={<Cart />}/>
            <Route path='/my-orders' element={<Orders />}/>
            <Route path='/contact-us' element={<ContactUs />}/>
            <Route path='/about-us' element={<AboutUs />}/>
            <Route path='/terms-of-use' element={<TermsOfUse />}/>
            <Route path='/faq' element={<Faq />}/>
            <Route path='*' element={<NotFound />}/>
        </Routes>
    </BrowserRouter>
    <KommunicateChat />
    </>
  );
}

export default App;
