import React, {useContext} from 'react';
import {StoreContext} from "../../context/StoreContext.jsx";
import FoodItem from "../FoodItem/FoodItem.jsx";

const FoodDisplay = ({category , searchText}) => {

    const {foodList} = useContext(StoreContext);
    const filteredFoods = foodList.filter(food => (
        (category === 'All' || food.category === category) &&
        food.name.toLowerCase().includes(searchText.toLowerCase())

    ));

    return (
        <div className="container">
            <div className="row">
                {filteredFoods.length > 0 ? (filteredFoods.map((food, index) => (
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
