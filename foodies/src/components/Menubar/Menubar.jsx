 import React, {useContext} from "react";
import "./Menubar.css";
import { assets } from "../../assets/assets";
import {Link} from "react-router-dom";
 import {StoreContext} from "../../context/StoreContext.jsx";

const Menubar = () => {
    const {quantities} = useContext(StoreContext);

    // const totalItems = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);

    const uniqueItems = Object.values(quantities)
        .filter(qty => qty> 0)
        .length;

    return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
          <Link to="/"><img src={assets.logo} alt="" className="mx-4" height={48} width={48} /></Link>


        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/explore">
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Constact us
              </Link>
            </li>
            
          </ul>
          <div className="d-flex align-items-center                  ">
            <Link to={"/cart"} className="position-relative">
                <img src={assets.cart} alt="" height={32} width={32}  className="position-relative"/>
                {uniqueItems > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                        {uniqueItems}
                    </span>
                )}
             </Link>
             <button className="btn btn-outline-primary ms-3" type="submit">
               Login
             </button>
             <button className="btn btn-outline-success ms-3" type="submit">
               Register
             </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
