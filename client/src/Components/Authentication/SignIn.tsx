import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../../firebase-config.js';
import '../../Styles/LandingAuth/AuthenticationStyles.css'; 
import { useNavigate } from 'react-router-dom';
import { Player } from '@shared/types.js';

interface SignInComponentProps {
  onSwitch: () => void;
}

const SignInComponent: React.FC<SignInComponentProps> = ({ onSwitch }) => {
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate(); // For navigation

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log(userCredential.user);
      setErrorMessage('');
      navigate('/home'); 
    } catch (error: any) { 
      if (error.code === 'auth/invalid-login-credentials') {
        setErrorMessage('Invalid login credentials');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      } else {
        alert(error.code);
      }
    }
  };
  

  return (
    <div className="auth-container">
      <div className="login-text">Sign In</div>
      <input
        className="login-input"
        type="email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <input 
        className="login-input"
        type="password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        placeholder="Enter your password"
      />
      <button className="auth-button" onClick={handleLogin}>Sign In</button>
      {errorMessage && <p>{errorMessage}</p>}
      <div className="switch-auth" onClick={onSwitch}>Need an account? Sign Up</div>
    </div>

  );
};

export default SignInComponent;
