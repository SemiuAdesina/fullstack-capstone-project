// Step 1 - Import Required Modules and Configurations
import React, { useState } from 'react';

// Step 1 - Task 1: Import backend URL configuration from `config.js`
import { urlConfig } from '../../config';

// Step 1 - Task 2: Import the useAppContext hook for managing global authentication state
import { useAppContext } from '../../context/AuthContext';

// Step 1 - Task 3: Import useNavigate from `react-router-dom` to handle post-registration navigation
import { useNavigate } from 'react-router-dom';

// Step 1 - Task 4: Import CSS styling for the registration page
import './RegisterPage.css';

function RegisterPage() {
    // Step 1 - Task 5: Initialize state variables for user input fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Step 1 - Task 6: Include a state for displaying error messages
    const [showerr, setShowerr] = useState('');

    // Step 1 - Task 7: Create local variables for navigation and global login context
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    // Step 2 - Implement Registration API Call
    const handleRegister = async () => {
        try {
            // Step 2 - Task 1: Call the backend API to register the user
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                // Step 2 - Task 2: Set HTTP method to POST
                method: 'POST',

                // Step 2 - Task 3: Define headers to send JSON data
                headers: {
                    'Content-Type': 'application/json',
                },

                // Step 2 - Task 4: Convert user input into JSON and send in request body
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                })
            });

            // Step 2 - Task 5: Parse the response from the server
            const json = await response.json();
            console.log('Server Response:', json);  // Log response for debugging

            // Step 2 - Task 6: If registration is successful, save the auth token and user info
            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);  // Save JWT token
                sessionStorage.setItem('name', firstName);  // Save user's name
                sessionStorage.setItem('email', json.email);  // Save user's email

                // Step 2 - Task 7: Update global login state and redirect to the app dashboard
                setIsLoggedIn(true);
                navigate('/app');  // Redirect to dashboard or homepage
            }

            // Step 2 - Task 8: If there is an error in registration, display it to the user
            if (json.error) {
                setShowerr(json.error);
            }
        } catch (e) {
            console.error("Error registering user:", e.message);
            setShowerr('Server error. Please try again later.');
        }
    };

    // Step 3 - Render Registration Form
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>

                        {/* Step 3 - Task 1: First Name Input */}
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                                id="firstName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        {/* Step 3 - Task 2: Last Name Input */}
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input
                                id="lastName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        {/* Step 3 - Task 3: Email Input */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {/* Step 3 - Task 4: Display Error Message */}
                            {showerr && <div className="text-danger">{showerr}</div>}
                        </div>

                        {/* Step 3 - Task 5: Password Input */}
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Step 3 - Task 6: Submit Registration Button */}
                        <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Register</button>

                        {/* Step 3 - Task 7: Link to Login Page */}
                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Step 4 - Export the RegisterPage Component
export default RegisterPage;
