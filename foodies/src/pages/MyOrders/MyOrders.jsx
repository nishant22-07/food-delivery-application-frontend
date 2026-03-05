import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import axios from "axios";
import {assets} from "../../assets/assets.js";
import './MyOrders.css'

const MyOrders = () => {
    const { token } = useContext(StoreContext);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                "http://localhost:8080/api/orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setData(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className="container">
            <div className="py-5 row justify-content-center">
                <div className="col-11 card p-3">

                    <h4 className="mb-4">My Orders</h4>

                    {loading ? (
                        <div className="text-center py-4">
                            Loading orders...
                        </div>
                    ) : data.length === 0 ? (
                        <div className="text-center py-4">
                            No orders found.
                        </div>
                    ) : (
                        <table className="table table-responsive">
                            <thead>
                            <tr>
                                <th></th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Total Items</th>
                                <th>Status</th>
                                <th>Refresh</th>
                            </tr>
                            </thead>

                            <tbody className="justify-content-center">
                            {data.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <img
                                            src={assets.delivery}
                                            alt="order"
                                            height={48}
                                            width={48}
                                        />
                                    </td>

                                    <td>
                                        {order.orderedItems?.map((item, index) =>
                                            index === order.orderedItems.length - 1
                                                ? `${item.name} x ${item.quantity}`
                                                : `${item.name} x ${item.quantity}, `
                                        )}
                                    </td>

                                    <td>&#x20B9;{order.amount.toFixed(2)}</td>

                                    <td>
                                        Items: {order.orderedItems?.length}
                                    </td>

                                    <td className="fw-bold text-capitalize">
                                        ● {order.orderStatus}
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={fetchOrders}
                                        >
                                            <i className="bi bi-arrow-clockwise"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;