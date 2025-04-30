import React, { useContext } from 'react';
import { RestaurantContext } from '../contexts/RestaurantContext';

const DishCard = ({ dish }) => {
    const { handleAddToCart, handleRemoveFromCart, cartItems } = useContext(RestaurantContext);
    const cartItem = cartItems.find(item => item._id === dish._id);

    return (
        <div className="dish-card">
            <img 
                src={dish.image} 
                alt={dish.name} 
                className="dish-image"
            />
            <h3 className="dish-title">{dish.name}</h3>
            <p className="dish-price">${dish.price.toFixed(2)}</p>
            
            <div className="quantity-controls">
                <button 
                    onClick={() => handleRemoveFromCart(dish)}
                    className="quantity-btn"
                    disabled={!cartItem}
                >
                    -
                </button>
                <span className="quantity">
                    {cartItem?.quantity || 0}
                </span>
                <button 
                    onClick={() => handleAddToCart(dish)}
                    className="quantity-btn"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default DishCard;