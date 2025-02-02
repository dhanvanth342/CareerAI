
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
            {/* Display user first name */}
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

