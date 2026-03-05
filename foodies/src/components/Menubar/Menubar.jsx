import React, {useContext, useState} from "react";
import "./Menubar.css";
import {assets} from "../../assets/assets";
import {Link, useNavigate} from "react-router-dom";
import {StoreContext} from "../../context/StoreContext.jsx";

const Menubar = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState("Home");

    const {quantities,token,setToken, setQuantities} = useContext(StoreContext);

    // const totalItems = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);

    const uniqueItems = Object.values(quantities)
        .filter(qty => qty > 0)
        .length;

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setQuantities({});
        navigate("/");

    }

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">
                <Link to="/"><img src={assets.logo} alt="" className="mx-4" height={48} width={48}/></Link>


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
                            <Link className={active === 'home' ? "nav-link fw-bold active" : "nav-link"} to="/"
                                  onClick={() => setActive("home")}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={active === 'explore' ? "nav-link fw-bold active" : "nav-link"}
                                  to="/explore" onClick={() => setActive("explore")}>
                                Explore
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={active === 'contact-us' ? "nav-link fw-bold active" : "nav-link"}
                                  to="/contact" onClick={() => setActive("contact-us")}>
                                Contact us
                            </Link>
                        </li>

                    </ul>
                    <div className="d-flex align-items-center">
                        <Link to={"/cart"} className="position-relative">
                            <img src={assets.cart} alt="" height={32} width={32} className="position-relative me-4"/>
                            {uniqueItems > 0 && (
                                <span
                                    className="position-absolute badge rounded-pill bg-warning"
                                    style={{
                                        top: "-5px",
                                        right: "5px",
                                        fontSize: "0.7rem"
                                    }}>
                        {uniqueItems}
                    </span>
                            )}
                        </Link>
                        {!token ?
                            <>
                                <button className="btn btn-outline-primary ms-3 btn-sm" type="submit" onClick={() =>navigate("/login")}>
                                    Login
                                </button>

                                <button className="btn btn-outline-success ms-3 btn-sm" type="submit" onClick={() =>navigate("/register")}>
                                    Register
                                </button>
                            </>:
                                <div className="dropdown text-end">
                                    <a
                                        href="#"
                                        className="d-block link-body-emphasis text-decoration-none dropdown-toggle "
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <img
                                            src={assets.profile}
                                            alt=""
                                            width={32}
                                            height={32}
                                            className="rounded-circle"
                                        />
                                    </a>

                                    <ul className="dropdown-menu text-small">
                                        <li className="dropdown-item"
                                            onClick={() => navigate("/myorders")}
                                        >
                                            Orders
                                        </li>
                                        <li className="dropdown-item"
                                            onClick={logout}
                                        >
                                            Logout
                                        </li>
                                    </ul>

                                </div>


                        }


                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Menubar;
