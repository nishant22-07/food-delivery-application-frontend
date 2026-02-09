import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./ListFood.css";
import { getFoodList } from "../../Services/foodService";
import { deleteFood } from "../../Services/foodService";

const ListFood = () => {
  const [list, setList] = useState([]);
  const fetchList = async () => {
    try{
      const data = await getFoodList();
      setList(data);
    }catch(error){
      toast.error("Error fetching food list");
    }
    
  };

  //   const removeFood = async (id) => {
  //     try {
  //       await axios.delete(`http://localhost:8080/api/foods/${id}`);
  //         toast.success("Food removed successfully");
  //         fetchList();
  //     } catch (error) {
  //       toast.error("Error removing food");
  //     }
  //     };

  const removeFood = async (foodId) => {
    try {
      const success = await deleteFood(foodId);
      if (success) {
        toast.success("Food removed successfully");
        await fetchList();
      }else{
        toast.error("Error removing food");
      }
    } catch (error) {
      toast.error("Error removing food");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="py-5 row justify-content-center">
      <div className="card col-11">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <img src={item.imageUrl} alt="" height={48} width={48} />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>&#8377;{item.price}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFood(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListFood;
