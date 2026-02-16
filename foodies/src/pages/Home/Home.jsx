import React from 'react';
import Header from "../../components/Hader/Header.jsx";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu.jsx";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay.jsx";

const Home = () => {
    return (
        <main className="container">
            <Header></Header>

            <ExploreMenu></ExploreMenu>
            <FoodDisplay/>
        </main>
    )
}
export default Home;
