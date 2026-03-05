import {createContext, useEffect, useState} from "react";
import {fetchFoodList} from "../Service/foodService.js";
import axios from "axios";
import {addToCart, getCartData, removeQtyFromCart} from "../Service/cartService.js";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {

    const[foodList, setFoodList] = useState([]);
    const[quantities, setQuantities] = useState({}); // This will hold the quantities of each food item
    const [token,setToken] = useState("");


    const increaseQty = async (foodId) => {
        setQuantities((prev) => ({...prev, [foodId]: (prev[foodId] || 0) + 1}));
        await addToCart(foodId,token);

    }
    const decreaseQty = async (foodId) => {
        setQuantities((prev) => ({...prev, [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0 }));
        await removeQtyFromCart(foodId,token);
    }

    const removeFromCart = (foodId) => {
        setQuantities((prevQuantities) => {
            const updatedQuantities = {...prevQuantities};
            delete updatedQuantities[foodId]; // This will remove the food item from the quantities object
            return updatedQuantities;
        });
    }
    const loadCartData = async (token) => {
        const  items = await getCartData(token)

        setQuantities(items);
    }

    const contextValue = {
        foodList,
        increaseQty,
        decreaseQty,
        quantities,
        removeFromCart,
        token,
        setToken,
        setQuantities,
        loadCartData,
    }; // You can add any state or functions you want to share across components here

    useEffect(() => {
        async function loadData(){
            const data = await fetchFoodList();
            setFoodList(data);
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));

            }
        }
        loadData();

    }, []);

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}























