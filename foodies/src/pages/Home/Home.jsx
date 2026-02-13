import React from 'react';
import Header from "../../components/Hader/Header.jsx";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu.jsx";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay.jsx";

const Home = () => {
    return (
        <main className="container">
            <Header></Header>
            <FoodDisplay/>
            <ExploreMenu></ExploreMenu>
        </main>
    )
}
export default Home;
