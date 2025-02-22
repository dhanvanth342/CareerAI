/*
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import '../index.css';
import { auth, db } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";

function MainPage() {
    const [userDetails, setUserDetails] = useState(null);

    // Fetch user details from Firestore
    useEffect(() => {
        const fetchUserDetails = async () => {
            const user = auth.currentUser;  // Get the currently logged-in user

            if (user) {
                const userDocRef = doc(db, "Users", user.uid);  // Reference to Firestore document
                const userDoc = await getDoc(userDocRef);  // Fetch the document

                if (userDoc.exists()) {
                    setUserDetails(userDoc.data());  // Set the user details
                } else {
                    console.log("No user data found!");
                }
            }
        };

        fetchUserDetails();
    }, []);

    const handleAIPrompt = () => {
        alert("AI Prompt generation coming soon!");
    };

    const handleManualPrompt = () => {
        alert("Manual prompt input coming soon!");
    };

    return (
        <div>

            {userDetails && (
                <div>
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "10px" }}>
                        Hello, how are you {userDetails.firstName}!
                    </p>
                </div>
            )}

            <div className="app">
                <Navbar />
                <div className="container">
                    <Card
                        title="Generate AI Prompt"
                        description="Select this option to generate an AI-driven prompt for career recommendations."
                        buttonText="Generate Prompt"
                        onClick={handleAIPrompt}
                    />

                    <Card
                        title="Write Your Own Prompt"
                        description="Input your own prompt to get top 5 career recommendations."
                        buttonText="Write Prompt"
                        onClick={handleManualPrompt}
                    />
                </div>
            </div>
        </div>
    );
}

export default MainPage;
*/

/*
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import '../index.css';
import { auth, db } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";

function MainPage() {
    const [userDetails, setUserDetails] = useState(null);
    const navigate = useNavigate();  // Initialize navigate

    // Fetch user details from Firestore
    useEffect(() => {
        const fetchUserDetails = async () => {
            const user = auth.currentUser;  // Get the currently logged-in user

            if (user) {
                const userDocRef = doc(db, "Users", user.uid);  // Reference to Firestore document
                const userDoc = await getDoc(userDocRef);  // Fetch the document

                if (userDoc.exists()) {
                    setUserDetails(userDoc.data());  // Set the user details
                } else {
                    console.log("No user data found!");
                }
            }
        };

        fetchUserDetails();
    }, []);

    // Navigate to PromptPage
    const handleAIPrompt = () => {
        navigate("/PromptPage");  // Redirect to the PromptPage
    };

    const handleManualPrompt = () => {
        alert("Manual prompt input coming soon!");
    };

    return (
        
        <div>

            {userDetails && (
                <div>
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "10px" }}>
                        Hello, how are you {userDetails.firstName}!
                    </p>
                </div>
            )}

            <div className="app">
                <Navbar />
                <div className="container">
                    <Card
                        title="Generate AI Prompt"
                        description="Select this option to generate an AI-driven prompt for career recommendations."
                        buttonText="Generate Prompt"
                        onClick={handleAIPrompt}  // Navigate to PromptPage on click
                    />

                    <Card
                        title="Write Your Own Prompt"
                        description="Input your own prompt to get top 5 career recommendations."
                        buttonText="Write Prompt"
                        onClick={handleManualPrompt}
                    />
                </div>
            </div>
        </div>
    );
}

export default MainPage;
*/

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import '../index.css';
import { auth, db } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";

function Mainpage() {
    const [userDetails, setUserDetails] = useState(null);
    const location = useLocation();
    const navigate = useNavigate(); // Access state passed through navigate

    // Fetch user details from Firestore or use passed state
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (location.state?.userDetails) {
                // Use the user details passed from the previous page
                setUserDetails(location.state.userDetails);
            } else {
                const user = auth.currentUser; // Get the currently logged-in user

                if (user) {
                    const userDocRef = doc(db, "Users", user.uid); // Reference to Firestore document
                    const userDoc = await getDoc(userDocRef); // Fetch the document

                    if (userDoc.exists()) {
                        setUserDetails(userDoc.data()); // Set the user details
                    } else {
                        console.log("No user data found!");
                    }
                }
            }
        };

        fetchUserDetails();
    }, [location.state]);

    const handleAIPrompt = () => {
        navigate("/PromptPage");  // Redirect to the PromptPage
    };


    const handleManualPrompt = () => {
        alert("Manual prompt input coming soon!");
    };

    return (
        <div>
            {/* Display user details */}
            {userDetails && (
                <div>
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "10px" }}>
                        Hello, how are you {userDetails.firstName || userDetails.displayName}!
                    </p>
                    <p style={{ fontSize: "1rem", marginTop: "5px" }}>
                        Email: {userDetails.email}
                    </p>
                </div>
            )}

            <div className="app">
                <Navbar />
                <div className="container">
                    <Card
                        title="Generate AI Prompt"
                        description="Select this option to generate an AI-driven prompt for career recommendations."
                        buttonText="Generate Prompt"
                        onClick={handleAIPrompt}
                    />

                    <Card
                        title="Write Your Own Prompt"
                        description="Input your own prompt to get top 5 career recommendations."
                        buttonText="Write Prompt"
                        onClick={handleManualPrompt}
                    />
                </div>
            </div>
        </div>
    );
}

export default Mainpage;

