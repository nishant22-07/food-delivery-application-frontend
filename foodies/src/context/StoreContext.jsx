import {createContext, useEffect, useState} from "react";
import {fetchFoodList} from "../Service/FoodService.js";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {

    const[foodList, setFoodList] = useState([]);
    const[quantities, setQuantities] = useState({}); // This will hold the quantities of each food item

    const increaseQty = (foodId) => {
        setQuantities((prev) => ({...prev, [foodId]: (prev[foodId] || 0) + 1}));
    }
    const decreaseQty = (foodId) => {
        setQuantities((prev) => ({...prev, [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0 }));
    }

    const removeFromCart = (foodId) => {
        setQuantities((prevQuantities) => {
            const updatedQuantities = {...prevQuantities};
            delete updatedQuantities[foodId]; // This will remove the food item from the quantities object
            return updatedQuantities;
        });
    }
    const contextValue = {
        foodList,
        increaseQty,
        decreaseQty,
        quantities,
        removeFromCart
    }; // You can add any state or functions you want to share across components here

    useEffect(() => {
        async function loadData(){
            const data = await fetchFoodList();
            setFoodList(data);
        }
        loadData();

    }, []);

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}























