import React, {useState} from 'react';
import Header from "../../components/Hader/Header.jsx";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu.jsx";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay.jsx";

const Home = () => {
    const [category, setCategory] = useState('All');

    return (
        <main className="container">
            <Header></Header>

            <ExploreMenu category={category} setCategory={setCategory}/>
            <FoodDisplay category={category} searchText={''}/>
        </main>
    )
}
export default Home;
