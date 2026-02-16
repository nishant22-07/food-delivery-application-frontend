import {createContext, useEffect, useState} from "react";
import {fetchFoodList} from "../Service/FoodService.js";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {

    const[foodList, setFoodList] = useState([]);



    const contextValue = {
        foodList
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























