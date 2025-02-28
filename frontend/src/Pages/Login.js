/*
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import '../components/Styles/Login.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../components/firebase";
import { FaEye, FaEyeSlash } from 'react-icons/fa';


function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User Logged in successfully");
            navigate('/Mainpage', { state: { userDetails: { email: user.email, displayName: user.displayName || '' } } });
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                alert('The password you entered does not match. Please try again.');
            } else if (error.code === 'auth/user-not-found') {
                alert('No account found with this email. Please sign up first.');
            } else {
                alert(`Login failed: ${error.message}`);
            }
            console.log(error.message);
        }
    };

    return (
        <div 
            className="login-page" 
            
        >
            <div className="animated-text">
                <h1>Oh! Looks like someone's back! </h1>
            </div>

            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <button type="submit">Login</button>
                </form>

                <div className="options">
                    <p>New user? <span className="create-account" onClick={() => navigate('/signup')}>Create an account</span></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import '../components/Styles/Login.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../components/firebase";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false); // State for popup

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User Logged in successfully");
            navigate('/Mainpage', { state: { userDetails: { email: user.email, displayName: user.displayName || '' } } },{replace: true});
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                alert('The password you entered does not match. Please try again.');
            } else if (error.code === 'auth/user-not-found') {
                alert('No account found with this email. Please sign up first.');
            } else {
                alert(`Login failed: ${error.message}`);
            }
            console.log(error.message);
        }
    };

    return (
        <div className={`login-page ${showLoginPopup ? 'blur-background' : ''}`}>

            {/* Animated Text */}
            <div className="animated-text">
                <h1>Oh! Looks like someone's back! </h1>
            </div>

            {/* Button to Show Login Pop-up */}
            <button className="open-login-button" onClick={() => setShowLoginPopup(true)}>Login</button>

            {/* Login Pop-up */}
            {showLoginPopup && (
                <div className="popup-overlay" onClick={() => setShowLoginPopup(false)}>
                    <div className="login-popup-card" onClick={(e) => e.stopPropagation()}>
                        <h2>Login</h2>
                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <div className="password-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>
                            <button type="submit">Login</button>
                        </form>

                        <div className="options">
                            <p>New user? <span className="create-account" onClick={() => navigate('/signup',{replace: true})}>Create an account</span></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;