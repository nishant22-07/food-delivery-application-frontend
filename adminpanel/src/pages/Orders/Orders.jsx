import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../../assets/assets.js";
import './Orders.css'

const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
          "https://food-delivery-application-hgci.onrender.com/api/orders/all"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (event, orderId) => {
    const newStatus = event.target.value;

    try {
      const response = await axios.patch(
          `https://food-delivery-application-hgci.onrender.com/api/orders/status/${orderId}?status=${newStatus}`
      );

      if (response.status === 200) {
        // 🔥 Optimized state update (NO refetch)
        setData((prevData) =>
            prevData.map((order) =>
                order.id === orderId
                    ? { ...order, orderStatus: newStatus }
                    : order
            )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
      <div className="container">
        <div className="py-5 row justify-content-center">
          <div className="col-11 card p-3">
            <h4 className="mb-4">All Orders</h4>

            {loading ? (
                <div className="text-center py-4">Loading orders...</div>
            ) : data.length === 0 ? (
                <div className="text-center py-4">No orders found.</div>
            ) : (
                <table className="table table-responsive">
                  <thead>
                  <tr>
                    <th></th>
                    <th>Orders</th>
                    <th>Amount</th>
                    <th>Total Items</th>
                    <th>Update Status</th>
                  </tr>
                  </thead>

                  <tbody>
                  {data.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <img
                              src={assets.parcel}
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
                          <div className="text-muted small">{order.userAddress}</div>
                        </td>


                        <td>₹ {order.amount?.toFixed(2)}</td>

                        <td>Items: {order.orderedItems?.length}</td>


                        <td>
                          <select
                              className="form-select"
                              onChange={(event) =>
                                  updateStatus(event, order.id)
                              }
                              value={order.orderStatus}
                          >
                            <option value="Food preparing">
                              Food preparing
                            </option>
                            <option value="Out for delivery">
                              Out for delivery
                            </option>
                            <option value="Delivered">
                              Delivered
                            </option>
                          </select>
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

export default Orders;