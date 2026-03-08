import React, {useContext, useState} from 'react'
import {assets} from "../../assets/assets.js";
import {StoreContext} from "../../context/StoreContext.jsx";
import {calculateCartTotals} from "../../util/cartUtils.js";
import axios from "axios";
import {toast} from "react-toastify";
import {RAZORPAY_KEY} from "../../util/constants.js";
import {useNavigate} from "react-router-dom";
// import Razorpay from "razorpay";


const PlaceOrder = () => {
    const {foodList, quantities, setQuantities, token} = useContext(StoreContext);
    const navigate = useNavigate();

    const cartItems = foodList.filter(food => quantities[food.id] > 0);

    const {subtotal, shipping, tax, total} = calculateCartTotals(cartItems, quantities)

    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        state: '',
        city: '',
        zip: ''
    })

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(data => ({...data, [name]: value}));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const orderData = {
            userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}`,
            phoneNumber: data.phoneNumber,
            email: data.email,
            orderedItems: cartItems.map(item => ({
                foodId: item.foodId,
                quantity: quantities[item.id],
                price: item.price * quantities[item.id],
                category: item.category,
                imageUrl: item.imageUrl,
                description: item.description,
                name: item.name
            })),
            amount: total.toFixed(2),
            orderStatus: "preparing"
        };
        try {
            const response = await axios.post('https://food-delivery-application.up.railway.app/api/orders/create', orderData, {headers: {'Authorization': `Bearer ${token}`}});
            if (response.status === 201 && response.data.razorpayOrderId) {
                // initiate the payment
                initiateRazorpayPayment(response.data);
            } else {
                toast.error("Unable to place order. Please try again");
            }
        } catch (error) {
            toast.error("Unable to place order. Please try again");
        }

    };

    const initiateRazorpayPayment = (order) => {
        const options = {
            key: RAZORPAY_KEY,
            amount: order.amount * 100,
            currency: "INR",
            name: "Food Land",
            description: "Food order payment",
            order_id: order.razorpayOrderId,
            handler: async function (razorpayResponse) {
                await verifyPayment(razorpayResponse);
            },
            prefill: {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                contact: data.phoneNumber,
            },
            theme: {color: "#3399cc"},
            model: {
                ondismiss: async function () {
                    toast.error("Payment cancelled.");
                    await deleteOrder(order.id);
                },
            },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open()
    };

    const verifyPayment = async (razorpayResponse) => {
        const paymentData = {
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_order_id: razorpayResponse.razorpay_order_id,
            razorpay_Signature: razorpayResponse.razorpay_signature
        };
        try {
            const response = await axios.post('https://food-delivery-application.up.railway.app/api/orders/verify', paymentData, {headers: {'Authorization': `Bearer ${token}`}});
            if (response.status === 200) {
                toast.success("Payment successfully verified.");
                await clearCart();
                navigate('/myorders');
            } else {
                toast.error("Payment failed. Please try again");
                navigate('/')
            }
        } catch (error) {
            toast.error("Payment failed. Please try again");
        }

    }

    const deleteOrder =  async (orderId) => {
        try{
            await axios.delete('https://food-delivery-application.up.railway.app/api/orders/'+orderId, {headers: {'Authorization': `Bearer ${token}`}});
        }catch (error) {
            toast.error("Something went wrong, contact support.");
        }
    }

    const clearCart  = async () => {
        try{
            await axios.delete('https://food-delivery-application.up.railway.app/api/cart',{headers: {'Authorization': `Bearer ${token}`}});
            setQuantities({});
        }catch (error) {
            toast.error("Error while clearing the cart")
        }
    }


    return (
        <div className="container">
            <main>
                <div className="py-5 text-center"><img className="d-block mx-auto"
                                                       src={assets.logo}
                                                       alt="" width="98" height="98"/>
                </div>
                <div className="row g-5">
                    <div className="col-md-5 col-lg-4 order-md-last"><h4
                        className="d-flex justify-content-between align-items-center mb-3"><span
                        className="text-primary">Your cart</span> <span
                        className="badge bg-primary rounded-pill">{cartItems.length}</span></h4>
                        <ul className="list-group mb-3">
                            {cartItems.map((food) => (
                                <li key={food.id} className="list-group-item d-flex justify-content-between lh-sm">
                                    <div><h6 className="my-0">{food.name} x {quantities[food.id]}</h6>
                                        <small className="text-body-secondary">{food.category}</small></div>
                                    <span
                                        className="text-body-secondary">&#8377;{(food.price * quantities[food.id]).toFixed(2)}</span>
                                </li>
                            ))}

                            <li className="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                    <span className="my-0">Shipping</span>
                                </div>
                                <span
                                    className="text-body-secondary">{subtotal === 0 ? 0.0 : shipping.toFixed(2)}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                    <span className="my-0">Tax(10%)</span>
                                </div>
                                <span className="text-body-secondary">{tax.toFixed(2)}</span>
                            </li>


                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total (INR)</span>
                                <strong>&#8377;{total}</strong></li>
                        </ul>

                    </div>
                    <div className="col-md-7 col-lg-8"><h4 className="mb-3">Billing address</h4>
                        <form className="needs-validation" onSubmit={onSubmitHandler}>

                            <div className="row g-3">
                                <div className="col-sm-6"><label htmlFor="firstName" className="form-label">First
                                    name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="firstName"
                                        placeholder="Kanha"
                                        name="firstName"
                                        onChange={onChangeHandler}
                                        value={data.firstName}
                                        required/>

                                </div>
                                <div className="col-sm-6"><label htmlFor="lastName" className="form-label">Last
                                    name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        placeholder="Kudale"
                                        name="lastName"
                                        onChange={onChangeHandler}
                                        value={data.lastName}
                                        required/>

                                </div>
                                <div className="col-12">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <div className="input-group has-validation">
                                        <span className="input-group-text">@</span>
                                        <input type="email"
                                               className="form-control"
                                               id="email"
                                               placeholder="Email"
                                               name="email"
                                               onChange={onChangeHandler}
                                               value={data.email}
                                               required/>

                                    </div>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="phone" className="form-label">
                                        Phone number
                                    </label> <input
                                    type="Number"
                                    className="form-control"
                                    id="phone"
                                    placeholder="9552385451"
                                    name="phoneNumber"
                                    onChange={onChangeHandler}
                                    value={data.phoneNumber}
                                    required/>

                                </div>

                                <div className="col-12">
                                    <label htmlFor="address"
                                           className="form-label">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        placeholder="1234 Main St"
                                        name="address"
                                        onChange={onChangeHandler}
                                        value={data.address}
                                        required
                                    />

                                </div>
                                <div className="col-md-5">
                                    <label htmlFor="state" className="form-label">State</label>
                                    <select className="form-select"
                                            id="state"
                                            required
                                            name="state"
                                            onChange={onChangeHandler}
                                            value={data.state}>
                                        <option value="">Choose...</option>
                                        <option>Maharashtra</option>
                                    </select>

                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="state"
                                           className="form-label">City
                                    </label>
                                    <select
                                        className="form-select"
                                        id="city"
                                        required
                                        name="city"
                                        onChange={onChangeHandler}
                                        value={data.city}
                                    >
                                        <option value="">Choose...</option>
                                        <option>City</option>
                                    </select>

                                </div>
                                <div className="col-md-3"><label htmlFor="zip" className="form-label">Zip</label>
                                    <input type="text"
                                           className="form-control"
                                           id="zip"
                                           placeholder=""
                                           required
                                           name="zip"
                                           onChange={onChangeHandler}
                                           value={data.zip}
                                    />

                                </div>
                            </div>


                            <hr className="my-4"/>
                            <button className="w-100 btn btn-primary btn-lg mb-5" type="submit"
                                    disabled={cartItems.length === 0}>Continue to checkout
                            </button>
                        </form>
                    </div>
                </div>
            </main>

        </div>
    )
}
export default PlaceOrder;
