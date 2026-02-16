import React, {useContext} from 'react';
import {StoreContext} from "../../context/StoreContext.jsx";
import FoodItem from "../FoodItem/FoodItem.jsx";


const FoodDisplay = () => {
    const {foodList} = useContext(StoreContext);
    return (
        <div className="container">
            <div className="row">
                {foodList.length > 0 ? (foodList.map((food, index) => (
                    <FoodItem key={index}
                              name={food.name}
                              description={food.description}
                              id={food.id}
                              price={food.price}
                              imageUrl={food.imageUrl}
                    />

                ))) : (
                    <div className="col-12 d-flex justify-content-center align-items-center">
                        <p className="fs-4">No food items available</p>
                    </div>)}

            </div>
        </div>)
}
export default FoodDisplay;
