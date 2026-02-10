import React from 'react';
import Menubar from './components/Menubar/Menubar';
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import ExploreFood from "./pages/ExploreFood/ExploreFood.jsx";
import Contact from "./pages/Contact/Contact.jsx";



const App = () => {
  return (
    <div>
      <Menubar></Menubar>
        <Routes>
          <Route path="/" element={<Home/>} />
            <Route path="/explore" element={<ExploreFood/>} />
            <Route path="/contact" element={<Contact/>} />

        </Routes>
    </div>
  )
}

export default App;