import React, {useState} from 'react'
import "./Register.css"
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import axios from "axios";
import {registerUser} from "../../Service/authService.js";


const Register = () => {
    const navigate = useNavigate();
    const [data,setData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const onChangeHandler = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        setData(data => ({...data, [name]: value}));

    };

    const onSubmitHandler = async (e) =>{
        e.preventDefault();
        try{
            const response = await registerUser(data)
            if(response.status === 201){
                toast.success("User Successfully registered. Please login");
                navigate("/login");
            }else{
                toast.error("Unable to register please try again");
            }
        }catch(error){
            toast.error("Unable to register please try again");

        }
    };
    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card border-0 shadow rounded-3 my-5">
                        <div className="card-body p-4 p-sm-5">
                            <h5 className="card-title text-center mb-5 fw-light fs-5">Sign Up</h5>
                            <form onSubmit={onSubmitHandler}>
                                <div className="form-floating mb-3">
                                    <input type="text"
                                           className="form-control"
                                           id="floatingName"
                                           placeholder="Nishant Kudale"
                                           name="name"
                                           onChange={onChangeHandler}
                                           value={data.name}
                                           required
                                    />
                                    <label htmlFor="floatingName">Full Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="email"
                                           className="form-control"
                                           id="floatingInput"
                                           placeholder="name@example.com"
                                           name="email"
                                           onChange={onChangeHandler}
                                           value={data.email}
                                           required
                                    />
                                    <label htmlFor="floatingInput">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password"
                                           className="form-control"
                                           id="floatingPassword"
                                           placeholder="Password"
                                           name="password"
                                           onChange={onChangeHandler}
                                           value={data.password}
                                           required
                                    />
                                    <label htmlFor="floatingPassword">Password</label>
                                </div>

                                <div className="d-grid">
                                    <button className="btn btn-outline-primary btn-login text-uppercase "
                                            type="submit">Sign up
                                    </button>
                                </div>
                                <div className="d-grid mt-2">
                                    <button className="btn btn-outline-danger btn-login text-uppercase "
                                            type="submit">Reset
                                    </button>
                                </div>
                                <div>
                                    Already have an account? <Link to={"/Login"}>Sign In</Link>
                                </div>


                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Register
