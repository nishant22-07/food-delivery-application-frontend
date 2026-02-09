import React, { useState } from "react";

import { assets } from "../../assets/assets";
import { addFood } from "../../Services/foodService";
import { toast } from "react-toastify";



const AddFood = () => {
  const [image, setImage] = useState(null);

  const [data, setData] = useState({
    name: "",
    description: "",
    category: "Biryani",
    price: "",
  });

  // Handle input change
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  // Handle submit
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      await addFood(data, image);
      toast.success("Food added successfully");
      setData({name: "",description: "",category: "Biryani",price: ""});
      setImage(null);
    } catch (error) {
      toast.error("Error adding food");
    }
  };

  return (
    <div className="mt-3">
      <div className="row m-2">
        <div className="card col-md-8">
          <div className="card-body">
            <h2 className="mb-4">ADD FOOD</h2>

            <form onSubmit={onSubmitHandler}>
              {/* Image Upload */}
              <div className="mb-3">
                <label
                  htmlFor="image"
                  className="form-label"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    className="card"
                    src={image ? URL.createObjectURL(image) : assets.upload}
                    alt="upload"
                    width={150}
                  />
                </label>

                <input
                  style={{ cursor: "pointer" }}
                  type="file"
                  id="image"
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              {/* Name */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Chiken biryani"
                  id="name"
                  name="name"
                  className="form-control"
                  required
                  value={data.name}
                  onChange={onChangeHandler}
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Write desciption here...."
                  name="description"
                  className="form-control"
                  rows="5"
                  required
                  value={data.description}
                  onChange={onChangeHandler}
                />
              </div>

              {/* Category */}
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  style={{ cursor: "pointer" }}
                  id="category"
                  name="category"
                  className="form-control"
                  value={data.category}
                  onChange={onChangeHandler}
                >
                  <option value="Biryani">Biryani</option>
                  <option value="Burger">Burger</option>
                  <option value="Cake">Cake</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Icecream">Icecream</option>
                  <option value="Salad">Salad</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Price */}
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  placeholder="&#8377;200"
                  id="price"
                  name="price"
                  className="form-control"
                  required
                  value={data.price}
                  onChange={onChangeHandler}
                />
              </div>

              {/* Submit */}
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFood;
