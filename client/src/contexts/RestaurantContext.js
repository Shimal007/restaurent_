import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const RestaurantContext = createContext();

const RestaurantProvider = ({ children }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [user, setUser] = useState(null);
    const [authRedirect, setAuthRedirect] = useState('/');
    const navigate = useNavigate();
    const location = useLocation();

    // Load cart from localStorage when component mounts
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get("https://restaurent-dutp.onrender.com/api/restaurants");
                setRestaurants(response.data);
            } catch (error) {
                console.error("Error fetching restaurants:", error.message);
            }
        };

        fetchRestaurants();
        
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            // Load cart from localStorage
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                setCartItems(parsedCart);
                
                // Calculate total price
                const total = parsedCart.reduce(
                    (sum, item) => sum + item.price * item.quantity, 
                    0
                );
                setTotalPrice(total);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const login = async (credentials) => {
        try {
            const response = await axios.post(
                "https://restaurent-dutp.onrender.com/api/auth/login", 
                credentials
            );
            
            const { token, user: userData } = response.data;
            
            // Store user data and token
            const userToStore = {
                ...userData,
                token
            };
            
            setUser(userToStore);
            localStorage.setItem('user', JSON.stringify(userToStore));
            
            // Navigate to the page user was trying to access
            navigate(authRedirect);
        } catch (error) {
            throw new Error(error.response?.data?.error || "Login failed");
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post(
                "https://restaurent-dutp.onrender.com/api/auth/register", 
                userData
            );
            
            const { token, user: newUser } = response.data;
            
            // Store user data and token
            const userToStore = {
                ...newUser,
                token
            };
            
            setUser(userToStore);
            localStorage.setItem('user', JSON.stringify(userToStore));
            
            // Navigate to the page user was trying to access
            navigate(authRedirect);
        } catch (error) {
            throw new Error(error.response?.data?.error || "Registration failed");
        }
    };

    const logout = () => {
        setUser(null);
        setCartItems([]);
        setTotalPrice(0);
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        navigate('/');
    };

    const handleAddToCart = (dish) => {
        if (!user) {
            // Store current path for redirect after login
            setAuthRedirect(location.pathname);
            navigate('/auth');
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

    const placeOrder = async (deliveryAddress, paymentMethod) => {
        if (!user || cartItems.length === 0) {
            return;
        }

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    dish: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: totalPrice,
                deliveryAddress,
                paymentMethod
            };

            const response = await axios.post(
                "https://restaurent-dutp.onrender.com/api/orders",
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );

            // Clear cart after successful order
            setCartItems([]);
            setTotalPrice(0);
            localStorage.removeItem('cart');
            
            return response.data;
        } catch (error) {
            console.error("Error placing order:", error);
            throw new Error(error.response?.data?.error || "Failed to place order");
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
        register,
        logout,
        handleAddToCart,
        handleRemoveFromCart,
        placeOrder,
        authRedirect,
        setAuthRedirect
    };

    return (
        <RestaurantContext.Provider value={value}>
            {children}
        </RestaurantContext.Provider>
    );
};

export { RestaurantContext, RestaurantProvider };