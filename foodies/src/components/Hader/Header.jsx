import React from 'react';
import { Link } from "react-router-dom";
import headerImage from "../../assets/header.jpg";  // 👈 import it

const Header = () => {
    return (
        <div
            className="p-5 mb-4 rounded-3 mt-1 header"
            style={{
                backgroundImage: `url(${headerImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                color: "white"
            }}
        >
            <div className="container-fluid py-5">
                <h1 className="display-5 fw-bold">
                    Order your favourite food here
                </h1>
                <p className="col-md-8 fs-4">
                    Discover the best food and drinks in Pune
                </p>
                <Link to="/explore" className="btn btn-primary">
                    Explore Food
                </Link>
            </div>
        </div>
    )
}

export default Header;