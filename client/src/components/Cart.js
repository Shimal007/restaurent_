import React, { useContext, useState } from 'react';
import { RestaurantContext } from '../contexts/RestaurantContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, totalPrice, user, handleRemoveFromCart, placeOrder } = useContext(RestaurantContext);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [orderStatus, setOrderStatus] = useState('');
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            navigate('/auth');
            return;
        }
        setIsCheckingOut(true);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (!deliveryAddress) {
            setOrderStatus('Please enter a delivery address');
            return;
        }
        
        try {
            setOrderStatus('Processing your order...');
            await placeOrder(deliveryAddress, paymentMethod);
            setOrderStatus('Order placed successfully!');
            setIsCheckingOut(false);
            // Reset form fields
            setDeliveryAddress('');
            setPaymentMethod('card');
        } catch (error) {
            setOrderStatus(`Error: ${error.message}`);
        }
    };

    const handleRemoveItem = (item) => {
        handleRemoveFromCart(item);
    };

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h2>Your Cart {user && `(${user.name})`}</h2>
            </div>
            <div className="cart-content">
                {cartItems.length === 0 ? (
                    <div className="empty-cart">Your cart is empty</div>
                ) : (
                    <>
                        {isCheckingOut ? (
                            <div className="checkout-form">
                                {orderStatus && (
                                    <div className={orderStatus.includes('Error') ? 'error-message' : 'success-message'}>
                                        {orderStatus}
                                    </div>
                                )}
                                <form onSubmit={handlePlaceOrder}>
                                    <div className="form-group">
                                        <label htmlFor="address">Delivery Address</label>
                                        <textarea
                                            id="address"
                                            value={deliveryAddress}
                                            onChange={(e) => setDeliveryAddress(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="payment">Payment Method</label>
                                        <select
                                            id="payment"
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        >
                                            <option value="card">Credit Card</option>
                                            <option value="cash">Cash on Delivery</option>
                                        </select>
                                    </div>
                                    <div className="checkout-buttons">
                                        <button type="button" onClick={() => setIsCheckingOut(false)}>
                                            Back to Cart
                                        </button>
                                        <button type="submit" className="confirm-order-btn">
                                            Confirm Order
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <>
                                {cartItems.map((item) => (
                                    <div key={item._id} className="cart-item">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="cart-item-image"
                                        />
                                        <div className="cart-item-details">
                                            <div className="cart-item-name">{item.name}</div>
                                            <div className="cart-item-price">
                                                ${item.price.toFixed(2)} × {item.quantity}
                                            </div>
                                        </div>
                                        <button 
                                            className="remove-btn"
                                            onClick={() => handleRemoveItem(item)}
                                        >
                                            -
                                        </button>
                                    </div>
                                ))}
                                <div className="cart-total">
                                    <span>Total:</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <button 
                                    className="checkout-btn"
                                    onClick={handleCheckout}
                                >
                                    Proceed to Checkout
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;