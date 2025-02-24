
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import '../components/Styles/Login.css'; // Reusing the same CSS
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from "../components/firebase";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons
import { setDoc, doc } from "firebase/firestore";
import { toast } from 'react-toastify';

function Signup() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Function for signing in with Google
    const googleLogin = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                toast.success(`Welcome ${user.displayName}`, {
                    position: "top-center",
                });
                // Navigate to Mainpage with user details
                navigate('/Mainpage', { state: { userDetails: { displayName: user.displayName, email: user.email } } });
            })
            .catch((error) => {
                console.error('Error with Google Sign-In:', error.message);
                toast.error('Google Sign-In failed. Please try again.', {
                    position: "top-center",
                });
            });
    };

    // Password validation function
    const validatePassword = (password) => {
        const minLength = password.length >= 6;
        const hasCapitalLetter = /[A-Z]/.test(password); // Check for at least one capital letter
        return minLength && hasCapitalLetter;
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!validatePassword(password)) {
            alert('Password must be at least 6 characters long and contain at least one uppercase letter.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user) {
                await setDoc(doc(db, "Users", user.uid), {
                    firstName: firstName,
                });
            }
            alert(`Account created successfully for ${firstName} (${email})!`);
            // Navigate to Mainpage with user details
            navigate('/Mainpage', { state: { userDetails: { displayName: firstName, email } } });
        } catch (error) {
            console.log('Error creating user:', error.message);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Create Account</h2>
                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your Name"
                            required
                        />
                    </div>
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
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <button type="submit">Sign Up</button>
                </form>

                <div className="options">
                    <p>Already have an account? <span className="create-account" onClick={() => navigate('/Login')}>Log In</span></p>
                    <button
                        onClick={googleLogin}
                        style={{
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            padding: '10px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            borderRadius: '5px',
                            color: 'black',
                        }}
                    >
                        <img
                            src={require('../assets/googlo.png')} // Adjust the path to your image file
                            alt="Google Logo"
                            style={{ width: '24px', height: '24px', marginRight: '10px' }}
                        />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Signup;