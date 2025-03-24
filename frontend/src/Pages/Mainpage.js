import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar"; 
import "../components/Styles/Mainpage.css"; 
import { auth, db } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaArrowRight } from "react-icons/fa"; // Import arrow icon

function Mainpage() {
    const [userDetails, setUserDetails] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Fetch user details from Firestore or use passed state
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (location.state?.userDetails) {
                setUserDetails(location.state.userDetails);
            } else {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, "Users", user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        setUserDetails(userDoc.data());
                    } else {
                        console.log("No user data found!");
                    }
                }
            }
        };

        fetchUserDetails();
    }, [location.state]);

    return (
        <div>
            {/* Navbar at the top */}
            <Navbar />

            {/* Display user details */}
            {userDetails && (
                <div className="user-details">
                    <h3 className="user-greeting">
                        <p className="Name" >Hello</p>, {userDetails.firstName || userDetails.displayName}!
                    </h3>
                    <p className="sub-text">Choose an option to continue</p>
                </div>
            )}

            {/* Main Layout */}
            <div className="main-layout">
                {/* AI Help Section */}
                <div className="section" >
                    <div className="section-content">
                        <h2 className="section-title">We get it, figuring out what to search for can be tricky. 
                        Let AI do the work for you!</h2>
                        <p className="section-desc">
                        </p>
                        <ul className="section-list">
                            <li>🔍 Questions tailored to your interests.</li>
                            <li>🤖 AI-Generated prompt.</li>
                            <li>📊 Career insights customized for you.</li>
                        </ul>
                    </div>
                    <FaArrowRight className="arrow-icon" onClick={() => navigate("/PromptPage")} />
                </div>

                {/* Divider */}


                {/* Write Your Own Prompt Section */}
                <div className="section" >
                    <div className="section-content">
                        <h2 className="section-title">Write your own prompt. Tell us about yourself! The more we know, the better we can assist you.</h2>
       
                        <p className="section-desc">
                        </p>
                        <ul className="section-list">
                            <li>✍️ Express yourself freely</li>
                            <li>🎯 Refine and adjust instantly</li>
                            <li>🚀 Effortless career insights.</li>
                        </ul>
                    </div>
                    <FaArrowRight className="arrow-icon" onClick={() => navigate("/Writeprompt")} />
                </div>
            </div>
        </div>
    );
}

export default Mainpage;