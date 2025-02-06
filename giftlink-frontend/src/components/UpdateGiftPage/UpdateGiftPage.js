import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UpdateGiftPage.css';

function UpdateGiftPage() {
    const { id } = useParams();  // Extract gift ID from URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        condition: '',
        description: '',
        image: ''
    });
    const [file, setFile] = useState(null);  // Task 1: State for file upload
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Task 2: Fetch gift data to pre-fill the form
    useEffect(() => {
        const fetchGift = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${id}`);
                if (!response.ok) throw new Error('Failed to fetch gift details');
                const data = await response.json();
                setFormData(data);  // Pre-fill the form with existing data
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchGift();
    }, [id]);

    // Task 3: Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Task 4: Handle file selection
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);  // Capture selected file
    };

    // Task 5: Submit the updated gift to the backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = new FormData();  // Use FormData to handle both text and file
        updatedData.append('name', formData.name);
        updatedData.append('category', formData.category);
        updatedData.append('condition', formData.condition);
        updatedData.append('description', formData.description);

        if (file) {
            updatedData.append('image', file);  // Add new image if uploaded
        } else {
            updatedData.append('image', formData.image);  // Keep existing image if no file is selected
        }

        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${id}`, {
                method: 'PUT',  // Using PUT to update the gift
                body: updatedData  // Send FormData instead of JSON
            });

            if (!response.ok) throw new Error('Failed to update gift');
            alert('Gift updated successfully!');
            navigate(`/app/product/${id}`);  // Redirect to the updated gift's details page
        } catch (error) {
            console.error('Error updating gift:', error);
            alert('Error updating gift');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mt-5">
            <h2>Update Gift</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">  {/* Task 6: Set enctype for file upload */}
                
                {/* Task 7: Gift Name */}
                <div className="mb-3">
                    <label className="form-label">Gift Name</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                {/* Task 8: Category */}
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} required />
                </div>

                {/* Task 9: Condition */}
                <div className="mb-3">
                    <label className="form-label">Condition</label>
                    <input type="text" className="form-control" name="condition" value={formData.condition} onChange={handleChange} required />
                </div>

                {/* Task 10: Description */}
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required />
                </div>

                {/* Task 11: File Upload for Image */}
                <div className="mb-3">
                    <label className="form-label">Upload New Image (optional)</label>
                    <input type="file" className="form-control" name="image" onChange={handleFileChange} accept="image/*" />
                </div>

                {/* Task 12: Display current image */}
                {formData.image && !file && (
                    <div className="mb-3">
                        <p><strong>Current Image:</strong></p>
                        <img 
                            src={formData.image.startsWith('http') ? formData.image : `${urlConfig.backendUrl}${formData.image}`} 
                            alt={formData.name} 
                            className="img-thumbnail" 
                            style={{ width: '200px', height: 'auto' }}
                        />
                    </div>
                )}

                {/* Task 13: Submit Button */}
                <button type="submit" className="btn btn-success">Update Gift</button>
            </form>
        </div>
    );
}

export default UpdateGiftPage;
