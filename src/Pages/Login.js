/*
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import '../components/Styles/Login.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../components/firebase";
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import icons from react-icons

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);  // Toggle state

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User Logged in successfully");
            window.location.href = "/Mainpage";
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

    useEffect(() => {
        const initializeGoogleSignIn = () => {
            window.google.accounts.id.initialize({
                client_id: 'YOUR_GOOGLE_CLIENT_ID',  // Replace with actual Client ID
                callback: (response) => {
                    console.log('Google Sign-In Response:', response.credential);
                    alert('Signed in successfully with Google!');
                    navigate('/Mainpage');
                },
            });

            window.google.accounts.id.renderButton(
                document.getElementById('google-signin-button'),
                { theme: 'outline', size: 'large', text: 'signin_with', width: 300 }
            );
        };

        if (window.google) {
            initializeGoogleSignIn();
        } else {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleSignIn;
            document.body.appendChild(script);
        }
    }, [navigate]);

    return (
        <div className="login-page">
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
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <button type="submit">Login</button>
                </form>

                <div className="options">
                    <p>New user? <span className="create-account" onClick={() => navigate('/signup')}>Create an account</span></p>
                    <div id="google-signin-button" style={{ marginTop: '15px' }}></div>
                </div>
            </div>
        </div>
    );
}

export default Login;
*/

/*
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import '../components/Styles/Login.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../components/firebase";
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import icons from react-icons

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);  // Toggle state

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User Logged in successfully");
            window.location.href = "/Mainpage";
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
        <div className="login-page">

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
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
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


/* FINAL - 10:09PM 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import '../components/Styles/Login.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../components/firebase";
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import icons from react-icons

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);  // Toggle state

const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("User Logged in successfully");

        // Navigate to the main page and pass user details (if needed)
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
        <div className="login-page">
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
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
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

/*
import React, { useEffect, useState } from 'react';
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
        <div className="login-page">
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
import loginBackground from '../assets/spiral.jpg'; // Import background image

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
            style={{ backgroundImage: `url(${loginBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            {/* Animated Text */}
            <div className="animated-text">
                <h1>Oh! Looks like someone's back! </h1>
            </div>

            {/* Login Card */}
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
