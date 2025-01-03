
import Navbar from '../../Components/Navbar';
import Home from '../../Components/Home';
import { Routes, Route } from 'react-router-dom';  // Updated import
import Products from '../../Components/Products';
import Product from '../../Components/Product';

function App() {
    return (
        <>
            <Navbar />
            <Routes>  {/* Replaced Switch with Routes */}
                <Route exact path='/' element={<Home />} />  {/* Updated syntax */}
                <Route exact path='/products' element={<Products />} />  {/* Updated syntax */}
                <Route exact path='/product' element={<Product />} />  {/* Updated syntax */}
            </Routes>
        </>
    )
}

export default App;
