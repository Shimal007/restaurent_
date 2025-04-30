import React from 'react';

const RestaurantCard = ({ restaurant, onClick }) => {
    return (
        <div className="restaurant-card" onClick={onClick}>
            <img 
                src={restaurant.image} 
                alt={restaurant.name} 
                className="card-image"
            />
            <div className="card-content">
                <h3 className="card-title">{restaurant.name}</h3>
                <span className="card-rating">
                    {restaurant.rating} ★
                </span>
            </div>
        </div>
    );
};

export default RestaurantCard;