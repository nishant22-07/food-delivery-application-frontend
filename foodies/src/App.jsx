import React from 'react';
import Menubar from './components/Menubar/Menubar';
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import ExploreFood from "./pages/ExploreFood/ExploreFood.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import Header from "./components/Hader/Header.jsx";
import FoodDetails from "./pages/FoodDetails/FoodDetails.jsx";
import Cart from "./pages/Cart/Cart.jsx";



const App = () => {
  return (
    <div>
      <Menubar></Menubar>

        <Routes>
          <Route path="/" element={<Home/>} />
            <Route path="/explore" element={<ExploreFood/>} />
            <Route path="/contact" element={<Contact/>} />
            <Route path="/food/:id" element={<FoodDetails/>} />
            <Route path="/cart" element={<Cart/>} />

        </Routes>
    </div>
  )
}

export default App;