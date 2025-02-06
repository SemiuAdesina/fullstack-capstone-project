import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddGiftPage.css';

function AddGiftPage() {
    const navigate = useNavigate();  // Task 1: Setup navigation to redirect after form submission

    // Task 2: Initialize form data state
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        condition: '',
        description: '',
        image: null  // Change from empty string to null for file handling
    });

    // Task 3: Handle form input changes and update state
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // If the input is the file upload, handle it differently
        if (name === 'image') {
            setFormData(prevState => ({
                ...prevState,
                image: files[0]  // Store the selected file
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value  // Update other text inputs normally
            }));
        }
    };

    // Task 4: Submit the new gift to the backend with file upload
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission behavior

        // Create a FormData object to handle multipart/form-data
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('condition', formData.condition);
        formDataToSend.append('description', formData.description);
        if (formData.image) {
            formDataToSend.append('image', formData.image);  // Append the image file if selected
        }

        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/gifts`, {
                method: 'POST',
                body: formDataToSend  // Send form data as multipart/form-data
            });

            // Task 5: Check if the response is successful
            if (!response.ok) {
                throw new Error('Failed to add gift');  // Throw an error if the response is not ok
            }

            const data = await response.json();  // Parse response JSON
            console.log('Gift added:', data);  // Log the added gift data

            navigate('/');  // Task 6: Redirect to the main page after adding the gift
        } catch (error) {
            console.error('Error adding gift:', error);  // Task 7: Log any errors encountered
        }
    };

    return (
        <div className="container mt-5">
            <h2>Add New Gift</h2>
            {/* Task 8: Create form for adding new gift */}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Task 9: Input field for Gift Name */}
                <div className="mb-3">
                    <label className="form-label">Gift Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required  // Make this field mandatory
                    />
                </div>

                {/* Task 10: Input field for Category */}
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <input
                        type="text"
                        className="form-control"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Task 11: Input field for Condition */}
                <div className="mb-3">
                    <label className="form-label">Condition</label>
                    <input
                        type="text"
                        className="form-control"
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Task 12: Textarea for Description */}
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Task 13: Input field for uploading image from computer */}
                <div className="mb-3">
                    <label className="form-label">Upload Image</label>
                    <input
                        type="file"
                        className="form-control"
                        name="image"
                        accept="image/*"  // Restrict to image files only
                        onChange={handleChange}
                    />
                </div>

                {/* Task 14: Submit button */}
                <button type="submit" className="btn btn-primary">
                    Add Gift
                </button>
            </form>
        </div>
    );
}

export default AddGiftPage;
