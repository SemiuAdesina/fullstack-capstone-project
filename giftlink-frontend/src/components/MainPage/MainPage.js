import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    // Task 1: Fetch all gifts on component mount
    useEffect(() => {
        const fetchGifts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`;  // Fetch all gifts from the backend
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);  // Handle HTTP errors
                }
                const data = await response.json();
                setGifts(data);  // Set the fetched gifts in state
            } catch (error) {
                console.error('Fetch error:', error.message);  // Log any fetch errors
            }
        };

        fetchGifts();  // Call the fetch function on component mount
    }, []);

    // Task 2: Navigate to the details page using product ID
    const goToDetailsPage = (productId) => {
        console.log('Navigating to product with ID:', productId);  // Debug: Log the product ID
        navigate(`/app/product/${productId}`);  // Navigate to the product details page
    };

    // Task 3: Format timestamp into a readable date (handles both UNIX timestamps and ISO strings)
    const formatDate = (dateInput) => {
        let date;

        // Check if dateInput is a number (UNIX timestamp) or a string (ISO format)
        if (typeof dateInput === 'number') {
            date = new Date(dateInput * 1000);  // Convert UNIX timestamp to milliseconds
        } else {
            date = new Date(dateInput);  // Assume ISO string format
        }

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return "Invalid Date";  // Return fallback message if date is invalid
        }

        // Format date to "Month Day, Year" (e.g., February 3, 2025)
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    // Task 4: Apply condition-based CSS classes
    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";  // Apply CSS classes based on condition
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift._id} className="col-md-4 mb-4">  {/* Use MongoDB _id as key */}
                        <div className="card product-card">

                            {/* Task 4: Display gift image or placeholder */}
                            <div className="image-placeholder">
                                {gift.image ? (
                                    <img src={gift.image} alt={gift.name} className="card-img-top" />  // Display gift image
                                ) : (
                                    <div className="no-image-available">No Image Available</div>  // Show placeholder if no image
                                )}
                            </div>

                            <div className="card-body">
                                {/* Task 5: Display gift name */}
                                <h5 className="card-title">{gift.name}</h5>

                                {/* Task 6: Display gift condition with conditional styling */}
                                <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                    {gift.condition}  {/* Display the condition with appropriate styling */}
                                </p>

                                {/* Display formatted date when gift was added */}
                                <p className="card-text date-added">
                                    Added on: {formatDate(gift.date_added)}  {/* Format the date properly */}
                                </p>
                            </div>

                            <div className="card-footer">
                                {/* Task 2 (Updated): Navigate to details page using MongoDB _id */}
                                <button onClick={() => goToDetailsPage(gift._id)} className="btn btn-primary w-100">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
