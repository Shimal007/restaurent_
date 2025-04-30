import React, { useContext } from 'react';
import DishCard from './DishCard';
import { RestaurantContext } from '../contexts/RestaurantContext';

const DishesMenu = () => {
    const { selectedRestaurant } = useContext(RestaurantContext);

    return (
        <>
            <h1 className="menu-header">
                {selectedRestaurant?.name || 'Menu'}
            </h1>
            <div className="dish-grid">
                {selectedRestaurant?.menu.map((dish) => (
                    <DishCard key={dish._id} dish={dish} />
                ))}
            </div>
        </>
    );
};

export default DishesMenu;