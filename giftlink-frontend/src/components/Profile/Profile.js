// Step 1 - Import Required Libraries
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css';

// Step 1 - Task 1: Import backend URL configuration
import { urlConfig } from '../../config';

// Step 1 - Task 2: Import AppContext to manage user state globally
import { useAppContext } from '../../context/AuthContext';

const Profile = () => {
  // Step 1 - Task 3: Initialize states to manage user details and form status
  const [userDetails, setUserDetails] = useState({});
  const [updatedDetails, setUpdatedDetails] = useState({});
  const { setUserName } = useAppContext();  // For updating user name in context
  const [changed, setChanged] = useState("");  // To show success message
  const [editMode, setEditMode] = useState(false);  // Toggle between view and edit modes

  const navigate = useNavigate();

  // Step 1 - Task 4: Check if user is logged in, if not redirect to login
  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/app/login");
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  // Fetch user profile from session storage
  const fetchUserProfile = async () => {
    try {
      const email = sessionStorage.getItem("email");
      const name = sessionStorage.getItem("name");

      if (name && email) {
        const storedUserDetails = { name, email };
        setUserDetails(storedUserDetails);
        setUpdatedDetails(storedUserDetails);  // Initialize form with current details
      }
    } catch (error) {
      console.error("Error fetching profile details:", error);
    }
  };

  // Enable Edit Mode
  const handleEdit = () => {
    setEditMode(true);
  };

  // Step 1 - Task 5: Handle input change in the form
  const handleInputChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  /* ------------------------------------------
     Step 1: Implement API Call for handleSubmit()
  ------------------------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");

      if (!authtoken || !email) {
        navigate("/app/login");
        return;
      }

      // Payload containing updated user details
      const payload = { ...updatedDetails };

      // Step 1 - Task 1: Call the API with PUT method
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
        method: "PUT",  // Method to update user profile

        // Step 1 - Task 2: Set headers for authorization and content-type
        headers: {
          "Authorization": `Bearer ${authtoken}`,  // JWT Token for Authentication
          "Content-Type": "application/json",      // Specify JSON format
          "Email": email                           // Pass email in headers
        },

        // Step 1 - Task 3: Set body with updated user details
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Step 1 - Task 4: Update the user's name in the AppContext
        setUserName(updatedDetails.name);

        // Step 1 - Task 5: Update the user's name in session storage
        sessionStorage.setItem("name", updatedDetails.name);

        setUserDetails(updatedDetails);  // Reflect changes immediately in UI
        setEditMode(false);  // Exit edit mode

        // Display success message
        setChanged("Name Changed Successfully!");
        setTimeout(() => {
          setChanged("");
          navigate("/");
        }, 1000);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating details:", error);
    }
  };

  // JSX to Render Profile Component
  return (
    <div className="profile-container">
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={userDetails.email}
              disabled  // Email field is not editable
            />
          </label>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={updatedDetails.name}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Save</button>
        </form>
      ) : (
        <div className="profile-details">
          <h1>Hi, {userDetails.name}</h1>
          <p><b>Email:</b> {userDetails.email}</p>
          <button onClick={handleEdit}>Edit</button>

          {/* Display success message */}
          <span style={{ color: 'green', fontStyle: 'italic', fontSize: '12px' }}>
            {changed}
          </span>
        </div>
      )}
    </div>
  );
};

export default Profile;
