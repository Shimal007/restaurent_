import React from 'react';
import RestaurantList from '../components/RestaurantList';
import Cart from '../components/Cart';

const Home = () => {
  return (
    <div className="home-page">
      <RestaurantList />
      <Cart />
    </div>
  );
};

export default Home;