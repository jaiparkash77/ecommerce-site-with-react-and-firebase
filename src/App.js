import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './Components/Home';
import { Signup } from './Components/Signup';
import { Login } from './Components/Login';
import { NotFound } from './Components/NotFound';
import { AddProducts } from './Components/AddProducts';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/signup' element={<Signup />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/add-products' element={<AddProducts />}/>
            <Route path='*' element={<NotFound />}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
