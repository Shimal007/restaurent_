import React from 'react';
import DishesMenu from '../components/DishesMenu';
import Cart from '../components/Cart';
const MenuPage = () => {
  return (
    <div className="menu-page">
      <DishesMenu />
      <Cart />
    </div>
  );
};

export default MenuPage;