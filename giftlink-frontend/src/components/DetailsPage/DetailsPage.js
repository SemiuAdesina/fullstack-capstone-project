import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailsPage.css';
import { urlConfig } from '../../config';

function DetailsPage() {
    const navigate = useNavigate();
    const { productId } = useParams();  // Task 1: Extract product ID from the URL params
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const authenticationToken = sessionStorage.getItem('auth-token');
        if (!authenticationToken) {
            // Task 2: Check for authentication and redirect if no token found
            navigate('/app/login');
        }

        // Task 3: Fetch gift details based on productId from URL
        const fetchGift = async () => {
            try {
                const url = `${urlConfig.backendUrl}/api/gifts/${productId}`;  // Correct API URL
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGift(data);
            } catch (error) {
                setError(error.message);  // Task 4: Set error if fetch fails
            } finally {
                setLoading(false);
            }
        };

        fetchGift();

        // Task 5: Scroll to top when the component is mounted
        window.scrollTo(0, 0);
    }, [productId, navigate]);

    // Task 6: Navigate back to the previous page
    const handleBackClick = () => {
        navigate(-1);
    };

    // Task 7: Handle deleting the gift
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this gift?")) {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${productId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete the gift');
                }
                alert('Gift deleted successfully!');
                navigate('/');  // Redirect to main page after deletion
            } catch (error) {
                console.error('Error deleting gift:', error);
                alert('Failed to delete the gift');
            }
        }
    };

    // Task 8: Navigate to the update form
    const handleUpdate = () => {
        navigate(`/app/update/${productId}`);  // Redirect to update form
    };

    // Hardcoded comments for the product
    const comments = [
        { author: "John Doe", comment: "I would like this!" },
        { author: "Jane Smith", comment: "Just DMed you." },
        { author: "Alice Johnson", comment: "I will take it if it's still available." },
        { author: "Mike Brown", comment: "This is a good one!" },
        { author: "Sarah Wilson", comment: "My family can use one. DM me if it is still available. Thank you!" }
    ];

    if (loading) return <div>Loading...</div>;  // Task 9: Display loading indicator
    if (error) return <div>Error: {error}</div>;  // Task 10: Display error if any
    if (!gift) return <div>Gift not found</div>;  // Task 11: Show message if no gift found

    return (
        <div className="container mt-5">
            {/* Task 12: Back Button */}
            <button className="btn btn-secondary mb-3" onClick={handleBackClick}>Back</button>

            <div className="card product-details-card">
                <div className="card-header text-white">
                    <h2 className="details-title">{gift.name}</h2> {/* Task 13: Display gift name */}
                </div>
                <div className="card-body">
                    <div className="image-placeholder-large">
                        {gift.image ? (
                            // Task 14: Display gift image if available
                            <img 
                                src={gift.image.startsWith('http') ? gift.image : `${urlConfig.backendUrl}${gift.image}`} 
                                alt={gift.name} 
                                className="product-image-large" 
                            />
                        ) : (
                            <div className="no-image-available-large">No Image Available</div>
                        )}
                    </div>

                    {/* Task 15: Display gift details */}
                    <p><strong>Category:</strong> {gift.category}</p>
                    <p><strong>Condition:</strong> {gift.condition}</p>
                    <p><strong>Date Added:</strong> {formatDate(gift.date_added)}</p>
                    <p><strong>Age (Years):</strong> {gift.age_years ? gift.age_years.toFixed(1) : 'N/A'}</p>
                    <p><strong>Description:</strong> {gift.description}</p>
                </div>

                {/* Task 16: Add Delete and Update buttons */}
                <div className="card-footer d-flex justify-content-between">
                    <button className="btn btn-warning" onClick={handleUpdate}>Update Gift</button>
                    <button className="btn btn-danger" onClick={handleDelete}>Delete Gift</button>
                </div>
            </div>

            {/* Task 17: Display Comments Section */}
            <div className="comments-section mt-4">
                <h3 className="mb-3">Comments</h3>
                {comments.map((comment, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            <p className="comment-author"><strong>{comment.author}:</strong></p>
                            <p className="comment-text">{comment.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Task 18: Date formatting helper function
    function formatDate(dateInput) {
        let date;
        if (typeof dateInput === 'number') {
            date = new Date(dateInput * 1000);  // UNIX timestamp handling
        } else {
            date = new Date(dateInput);  // Handle ISO string dates
        }
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
    }
}

export default DetailsPage;
