import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import '../components/Styles/Intropage.css'; 
import '../index.css';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from "../components/firebase";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { setDoc, doc } from "firebase/firestore";
import logoImg from '../assets/logot.png';

function AnimatedBox({ initialPosition }) {
    const meshRef = useRef(null);
    const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(...initialPosition));
    const currentPosition = useRef(new THREE.Vector3(...initialPosition));

    useEffect(() => {
        const interval = setInterval(() => {
            const newPosition = new THREE.Vector3(
                Math.max(-30, Math.min(30, initialPosition[0] + (Math.random() - 0.5) * 6)),
                0.5,
                Math.max(-30, Math.min(30, initialPosition[2] + (Math.random() - 0.5) * 6))
            );
            setTargetPosition(newPosition);
        }, 2000);
        return () => clearInterval(interval);
    }, [initialPosition]);

    useFrame(() => {
        if (meshRef.current) {
            currentPosition.current.lerp(targetPosition, 0.1);
            meshRef.current.position.copy(currentPosition.current);
        }
    });

    return (
        <mesh ref={meshRef} position={initialPosition}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#82cded" opacity={0.9} transparent />
        </mesh>
    );
}


function Scene() {
    const initialPositions = [
      [-25, 0.5, -25], [25, 0.5, 25], [-20, 0.5, 15], [20, 0.5, -15], [10, 0.5, -25],
      [-10, 0.5, 25], [-30, 0.5, -10], [30, 0.5, 10], [-15, 0.5, 20], [15, 0.5, -20],
      [-5, 0.5, 5], [5, 0.5, -5], [-22, 0.5, -22], [22, 0.5, 22], [-18, 0.5, 18], [18, 0.5, -18],
      [-12, 0.5, -12], [12, 0.5, 12], [-8, 0.5, 8], [8, 0.5, -8], [0, 0.5, 0]
    ];

    return (
        <>
            <OrbitControls />
            <ambientLight intensity={0.7} />
            <pointLight position={[10, 10, 10]} />
            <Grid infiniteGrid cellSize={1} sectionSize={3} />
            {initialPositions.map((position, index) => (
                <AnimatedBox key={index} initialPosition={position} />
            ))}
        </>
    );
}

const Intropage = () => {
    const navigate = useNavigate();
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showSignupPopup, setShowSignupPopup] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const commonNavbar = document.getElementById("common-navbar");
        if (commonNavbar) commonNavbar.style.display = "none";
        return () => {
            if (commonNavbar) commonNavbar.style.display = "flex";
        };
    }, []);
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            navigate('/About');
        } catch (error) {
            alert(`Login failed: ${error.message}`);
        }
    };
    const handleSignup = async (e) => {
        e.preventDefault();
        if (signupPassword !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        if (signupPassword.length < 6 || !/[A-Z]/.test(signupPassword)) {
            alert('Password must be at least 6 characters and contain one uppercase letter.');
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
            await setDoc(doc(db, "Users", userCredential.user.uid), { firstName });
            navigate('/About');
        } catch (error) {
            alert(`Signup failed: ${error.message}`);
        }
    };
    const googleLogin = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(result => {
                navigate('/About', { state: { userDetails: { displayName: result.user.displayName, email: result.user.email } } });
            })
            .catch(error => alert(`Google Sign-In failed: ${error.message}`));
    };
    return (
        <div className="intro-container">
            <Canvas shadows camera={{ position: [40, 40, 40], fov: 50 }}>
                <Scene />
            </Canvas>
            <div className="overlay"></div>
            {/* Navbar */}
            <nav id="intropage-navbar" className="navbar">
            <img src={logoImg} alt="Logo" style={{ width: '95px', height: 'auto' }}/>
                <button className="animated-button" onClick={() => setShowLoginPopup(true)}>Log In</button>
            </nav>
            {/* Main Text */}
            <main className="main-content">
                <h1 className="center-title">Personalized career guidance, enhanced by <span className="highlight-text"> AI </span></h1>
                <p className="intro-text">
                    Your career journey starts here! We simplify career planning with AI-driven insights tailored to your interests, 
                    creating a personalized roadmap to help you pursue a career that truly excites you.
                </p>
                <button className="animated-get-button" onClick={() => setShowSignupPopup(true)}>Get Started ➝</button>
            </main>
            {/* Login Pop-up */}
            {/* Login Pop-up */}
            {showLoginPopup && (
    <div className="popup-overlay" onClick={() => setShowLoginPopup(false)}>
        <div className="login-popup-card" onClick={(e) => e.stopPropagation()}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label>Email</label>
                    <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" required />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <div className="password-wrapper">
                        <input type={showLoginPassword ? 'text' : 'password'} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" required />
                        <span className="password-toggle-icon" onClick={() => setShowLoginPassword(!showLoginPassword)}>
                            {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>
                <button type="submit">Login</button>
            </form>

            {/* ✅ "New User? Create an Account" Link */}
            <p className="new-user-text">
                New user? <span className="create-account" onClick={() => { setShowLoginPopup(false); setShowSignupPopup(true); }}>Create an account</span>
            </p>
        </div>
    </div>
)}

{/* Signup Pop-up */}
{showSignupPopup && (
    <div className="popup-overlay" onClick={() => setShowSignupPopup(false)}>
        <div className="login-popup-card" onClick={(e) => e.stopPropagation()}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <div className="input-group">
                    <label>Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Name" required />
                </div>
                <div className="input-group">
                    <label>Email</label>
                    <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="Email" required />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <div className="password-wrapper">
                        <input type={showSignupPassword ? 'text' : 'password'} value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="Password" required />
                        <span className="password-toggle-icon" onClick={() => setShowSignupPassword(!showSignupPassword)}>
                            {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>
                <div className="input-group">
                    <label>Confirm Password</label>
                    <div className="password-wrapper">
                        <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
                        <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>
                <button type="submit">Sign Up</button>
            </form>
            <button className="google-login-btn" onClick={googleLogin}>
                <img src={require('../assets/googlo.png')} alt="Google Logo" className="google-icon" />
                Sign in with Google
            </button>
        </div>
    </div>
)}
        </div>
    );
};

export default Intropage;
