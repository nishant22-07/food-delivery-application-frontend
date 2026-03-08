import React, {useContext, useState, useEffect} from 'react'
import {assets} from "../../assets/assets.js";
import {StoreContext} from "../../context/StoreContext.jsx";
import {calculateCartTotals} from "../../util/cartUtils.js";
import axios from "axios";
import {toast} from "react-toastify";
import {RAZORPAY_KEY} from "../../util/constants.js";
import {useNavigate} from "react-router-dom";
import {State, City} from "country-state-city";

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

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const indianStates = State.getStatesOfCountry("IN");
        setStates(indianStates);
    }, []);

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setData(data => ({...data, [name]: value}));

        if (name === "state") {
            const citiesOfState = City.getCitiesOfState("IN", value);
            setCities(citiesOfState);
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const orderData = {
            userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}`,
            phoneNumber: data.phoneNumber,
            email: data.email,
            orderedItems: cartItems.map(item => ({
                foodId: item.id,
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
            const response = await axios.post(
                'https://food-delivery-application.up.railway.app/api/orders/create',
                orderData,
                {headers: {'Authorization': `Bearer ${token}`}}
            );

            if (response.status === 201 && response.data.razorpayOrderId) {
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

            modal: {
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
            razorpay_signature: razorpayResponse.razorpay_signature
        };

        try {

            const response = await axios.post(
                'https://food-delivery-application.up.railway.app/api/orders/verify',
                paymentData,
                {headers: {'Authorization': `Bearer ${token}`}}
            );

            if (response.status === 200) {
                toast.success("Payment successfully verified.");
                await clearCart();
                navigate('/myorders');
            } else {
                toast.error("Payment failed. Please try again");
                navigate('/');
            }

        } catch (error) {
            toast.error("Payment failed. Please try again");
        }
    }

    const deleteOrder = async (orderId) => {
        try {
            await axios.delete(
                'https://food-delivery-application.up.railway.app/api/orders/' + orderId,
                {headers: {'Authorization': `Bearer ${token}`}}
            );
        } catch (error) {
            toast.error("Something went wrong, contact support.");
        }
    }

    const clearCart = async () => {
        try {
            await axios.delete(
                'https://food-delivery-application.up.railway.app/api/cart',
                {headers: {'Authorization': `Bearer ${token}`}}
            );
            setQuantities({});
        } catch (error) {
            toast.error("Error while clearing the cart")
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="container">

            <main>

                <div className="py-5 text-center">
                    <img className="d-block mx-auto"
                         src={assets.logo}
                         alt=""
                         width="98"
                         height="98"/>
                </div>

                <div className="row g-5">

                    <div className="col-md-5 col-lg-4 order-md-last">

                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-primary">Your cart</span>
                            <span className="badge bg-primary rounded-pill">{cartItems.length}</span>
                        </h4>

                        <ul className="list-group mb-3">

                            {cartItems.map((food) => (
                                <li key={food.id} className="list-group-item d-flex justify-content-between lh-sm">
                                    <div>
                                        <h6 className="my-0">{food.name} x {quantities[food.id]}</h6>
                                        <small className="text-body-secondary">{food.category}</small>
                                    </div>

                                    <span className="text-body-secondary">
                                        ₹{(food.price * quantities[food.id]).toFixed(2)}
                                    </span>

                                </li>
                            ))}

                            <li className="list-group-item d-flex justify-content-between">
                                <span>Shipping</span>
                                <span>{subtotal === 0 ? 0.0 : shipping.toFixed(2)}</span>
                            </li>

                            <li className="list-group-item d-flex justify-content-between">
                                <span>Tax (10%)</span>
                                <span>{tax.toFixed(2)}</span>
                            </li>

                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total (INR)</span>
                                <strong>₹{total}</strong>
                            </li>

                        </ul>

                    </div>

                    <div className="col-md-7 col-lg-8">

                        <h4 className="mb-3">Billing address</h4>

                        <form onSubmit={onSubmitHandler}>

                            <div className="row g-3">

                                <div className="col-sm-6">
                                    <label className="form-label">First name</label>
                                    <input type="text"
                                           className="form-control"
                                           name="firstName"
                                           value={data.firstName}
                                           onChange={onChangeHandler}
                                           required/>
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label">Last name</label>
                                    <input type="text"
                                           className="form-control"
                                           name="lastName"
                                           value={data.lastName}
                                           onChange={onChangeHandler}
                                           required/>
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Email</label>
                                    <input type="email"
                                           className="form-control"
                                           name="email"
                                           value={data.email}
                                           onChange={onChangeHandler}
                                           required/>
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Phone number</label>
                                    <input type="text"
                                           className="form-control"
                                           name="phoneNumber"
                                           value={data.phoneNumber}
                                           onChange={onChangeHandler}
                                           required/>
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Address</label>
                                    <input type="text"
                                           className="form-control"
                                           name="address"
                                           value={data.address}
                                           onChange={onChangeHandler}
                                           required/>
                                </div>

                                <div className="col-md-5">
                                    <label className="form-label">State</label>

                                    <select
                                        className="form-select"
                                        name="state"
                                        value={data.state}
                                        onChange={onChangeHandler}
                                        required
                                    >

                                        <option value="">Choose...</option>

                                        {states.map((state) => (
                                            <option key={state.isoCode} value={state.isoCode}>
                                                {state.name}
                                            </option>
                                        ))}

                                    </select>

                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">City</label>

                                    <select
                                        className="form-select"
                                        name="city"
                                        value={data.city}
                                        onChange={onChangeHandler}
                                        disabled={!data.state}
                                        required
                                    >

                                        <option value="">Choose...</option>

                                        {cities.map((city, index) => (
                                            <option key={index} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}

                                    </select>

                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">Zip</label>
                                    <input type="text"
                                           className="form-control"
                                           name="zip"
                                           value={data.zip}
                                           onChange={onChangeHandler}
                                           required/>
                                </div>

                            </div>

                            <hr className="my-4"/>

                            <div className="alert alert-info mt-4">

                                <h6><strong>Note for Recruiters</strong></h6>

                                <p>This payment gateway runs in <b>Razorpay Test Mode</b>.</p>

                                <div className="mb-3">

                                    <b>UPI Test IDs</b>

                                    <div className="d-flex align-items-center gap-2 mt-1">
                                        <span>razorpay@success</span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => copyToClipboard("razorpay@success")}
                                        >
                                            Copy
                                        </button>
                                    </div>

                                    <div className="d-flex align-items-center gap-2 mt-1">
                                        <span>razorpay@failure</span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => copyToClipboard("razorpay@failure")}
                                        >
                                            Copy
                                        </button>
                                    </div>

                                </div>

                                <div>

                                    <b>Card Test Details</b>

                                    <div className="d-flex align-items-center gap-2 mt-1">
                                        <span>4111 1111 1111 1111</span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => copyToClipboard("4111111111111111")}
                                        >
                                            Copy
                                        </button>
                                    </div>

                                    <small>Expiry: Any future date | CVV: Any 3 digits | OTP: 1234</small>

                                </div>

                            </div>

                            <button
                                className="w-100 btn btn-primary btn-lg mb-5"
                                type="submit"
                                disabled={cartItems.length === 0}
                            >
                                Continue to checkout
                            </button>

                        </form>

                    </div>

                </div>

            </main>

        </div>
    )
}

export default PlaceOrder;