import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RestaurantContext = createContext();

const RestaurantProvider = ({ children }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get("http://localhost:5000/restaurants");
                setRestaurants(response.data);
            } catch (error) {
                console.error("Error fetching restaurants:", error.message);
            }
        };

        fetchRestaurants();
        
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleAddToCart = (dish) => {
        if (!user) {
            navigate('/auth?mode=login');
            return;
        }
        
        const existingItemIndex = cartItems.findIndex((item) => item._id === dish._id);

        if (existingItemIndex !== -1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex] = {
                ...updatedCartItems[existingItemIndex],
                quantity: updatedCartItems[existingItemIndex].quantity + 1,
            };
            setCartItems(updatedCartItems);
        } else {
            setCartItems([...cartItems, { ...dish, quantity: 1 }]);
        }
        setTotalPrice((prev) => prev + dish.price);
    };

    const handleRemoveFromCart = (dish) => {
        const existingItemIndex = cartItems.findIndex((item) => item._id === dish._id);

        if (existingItemIndex !== -1) {
            const updatedCartItems = [...cartItems];
            if (updatedCartItems[existingItemIndex].quantity > 1) {
                updatedCartItems[existingItemIndex] = {
                    ...updatedCartItems[existingItemIndex],
                    quantity: updatedCartItems[existingItemIndex].quantity - 1,
                };
            } else {
                updatedCartItems.splice(existingItemIndex, 1);
            }
            setCartItems(updatedCartItems);
            setTotalPrice((prev) => prev - dish.price);
        }
    };

    const value = {
        restaurants,
        selectedRestaurant,
        setSelectedRestaurant,
        cartItems,
        totalPrice,
        user,
        login,
        logout,
        handleAddToCart,
        handleRemoveFromCart
    };

    return (
        <RestaurantContext.Provider value={value}>
            {children}
        </RestaurantContext.Provider>
    );
};

export { RestaurantContext, RestaurantProvider };