import React, { useState, useEffect } from 'react';

// Step 1 - Task 1: Import urlConfig from config.js to get backend URL
import { urlConfig } from '../../config';

// Step 1 - Task 2: Import useAppContext for managing global login state
import { useAppContext } from '../../context/AuthContext';

// Step 1 - Task 3: Import useNavigate from react-router-dom for page navigation
import { useNavigate } from 'react-router-dom';

import './LoginPage.css';

function LoginPage() {
    // Step 1 - Task 4: State for email, password, and incorrect login attempts
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState('');  // To display error messages

    // Step 1 - Task 5: Initialize navigation, bearerToken, and login context
    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('bearer-token');  // Check if token exists in session
    const { setIsLoggedIn } = useAppContext();  // Access context for managing login status

    // Step 1 - Task 6: If bearerToken exists, navigate to MainPage (user already logged in)
    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app');
        }
    }, [navigate]);

    // Step 3 - Implement API Call for handleLogin()
    const handleLogin = async (e) => {
        e.preventDefault();  // Prevent default form submission

        try {
            // API call to backend login route
            const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                // Step 1 - Task 7: Set the HTTP method to POST
                method: 'POST',

                // Step 1 - Task 8: Set request headers, including Authorization if bearerToken exists
                headers: {
                    'content-type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',  // Include token if available
                },

                // Step 1 - Task 9: Set body to send user email and password
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            });

            // Step 2 - Task 1: Access data coming from fetch API
            const json = await res.json();
            console.log('Server Response:', json);

            if (json.authtoken) {
                // Step 2 - Task 2: Save auth-token and user details in session storage
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);

                // Step 2 - Task 3: Update login state to true
                setIsLoggedIn(true);

                // Step 2 - Task 4: Navigate to the MainPage after successful login
                navigate('/app');
            } else {
                // Step 2 - Task 5: Handle incorrect password scenario
                document.getElementById("email").value = "";
                document.getElementById("password").value = "";
                setIncorrect("Wrong password. Try again.");

                // Clear error message after 2 seconds
                setTimeout(() => {
                    setIncorrect("");
                }, 2000);
            }
        } catch (error) {
            console.error("Error fetching login details: " + error.message);
            setIncorrect("An unexpected error occurred. Please try again.");
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        {/* Email Input */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setIncorrect("") }}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setIncorrect("") }}
                            />

                            {/* Step 2 - Task 6: Display error message for incorrect password */}
                            <span style={{
                                color: 'red',
                                height: '.5cm',
                                display: 'block',
                                fontStyle: 'italic',
                                fontSize: '12px'
                            }}>{incorrect}</span>
                        </div>

                        {/* Login Button */}
                        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>

                        {/* Redirect to Register Page */}
                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
