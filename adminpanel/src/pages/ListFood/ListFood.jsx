import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ListFood.css";
import { getFoodList, deleteFood } from "../../Services/foodService";

const ListFood = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch food list
  const fetchFoodList = async () => {
    setLoading(true);
    try {
      const data = await getFoodList();
      setList(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching food list");
    } finally {
      setLoading(false);
    }
  };

  // Delete food item
  const removeFood = async (foodId) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this food item?"
    );

    if (!confirmDelete) return;

    try {
      const success = await deleteFood(foodId);

      if (success) {
        toast.success("Food removed successfully");
        fetchFoodList(); // refresh list
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error removing food");
    }
  };

  useEffect(() => {
    fetchFoodList();
  }, []);

  return (
      <div className="py-5 row justify-content-center">
        <div className="card col-11 p-3 shadow">
          <h4 className="mb-3 text-center">Food List</h4>

          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price (₹)</th>
              <th>Action</th>
            </tr>
            </thead>

            <tbody>
            {loading ? (
                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>
            ) : list.length === 0 ? (
                <tr>
                  <td colSpan="5">No food items found</td>
                </tr>
            ) : (
                list.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            height={50}
                            width={50}
                            style={{ objectFit: "cover", borderRadius: "5px" }}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>₹ {item.price}</td>
                      <td>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removeFood(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default ListFood;