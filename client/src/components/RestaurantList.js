import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "./RestaurantCard";
import { RestaurantContext } from "../contexts/RestaurantContext";

const RestaurantList = () => {
    const { restaurants, setSelectedRestaurant, user, logout } = useContext(RestaurantContext);
    const [filteredRestaurants, setFilteredRestaurants] = useState([...restaurants]);
    const [ratingFilter, setRatingFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        filterRestaurants();
    }, [ratingFilter, searchTerm, restaurants]);

    const filterRestaurants = () => {
        let filtered = [...restaurants];
        
        if (ratingFilter) {
            filtered = filtered.filter(
                (restaurant) => restaurant.rating >= parseFloat(ratingFilter)
            );
        }

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter((restaurant) =>
                restaurant.name.toLowerCase().includes(searchLower)
            );
        }

        setFilteredRestaurants(filtered);
    };

    const handleRestaurantClick = (restaurant) => {
        setSelectedRestaurant(restaurant);
        navigate('/menu');
    };

    return (
        <>
            <div className="navbar">
                <div className="nav-logo">FoodExpress</div>
                <div className="nav-links">
                    <a href="/" className="nav-link">Home</a>
                    {user && <a href="/menu" className="nav-link">Menu</a>}
                </div>
                <div className="auth-buttons">
                    {user ? (
                        <button onClick={logout} className="auth-button">
                            Logout
                        </button>
                    ) : (
                        <button onClick={() => navigate('/auth?mode=login')} className="auth-button">
                            Login
                        </button>
                    )}
                </div>
            </div>

            <div className="restaurant-list">
                <h1 className="list-header">Discover Restaurants</h1>
                
                <div className="filter-container">
                    <input
                        type="number"
                        placeholder="Filter by minimum rating"
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="filter-input"
                        min="1"
                        max="5"
                        step="0.1"
                    />
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="filter-input"
                    />
                </div>

                <div className="restaurant-grid">
                    {filteredRestaurants.map((restaurant) => (
                        <RestaurantCard
                            key={restaurant._id}
                            restaurant={restaurant}
                            onClick={() => handleRestaurantClick(restaurant)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default RestaurantList;