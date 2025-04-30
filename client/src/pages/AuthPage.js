import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RestaurantContext } from '../contexts/RestaurantContext';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthRedirect } = useContext(RestaurantContext);

  useEffect(() => {
    // Check for redirect params in URL
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    const redirect = searchParams.get('redirect');
    
    if (mode === 'signup') {
      setIsLogin(false);
    }
    
    if (redirect) {
      setAuthRedirect(decodeURIComponent(redirect));
    }
  }, [location, setAuthRedirect]);

  const switchAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        {isLogin ? (
          <Login onSwitch={switchAuthMode} />
        ) : (
          <Signup onSwitch={switchAuthMode} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;