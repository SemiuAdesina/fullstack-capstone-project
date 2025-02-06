import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { urlConfig } from '../../config';

function SearchPage() {
    // Task 1: Define state variables for the search query, age range, and search results
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6);  // Default value for age range
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    const navigate = useNavigate();

    // Fetch all products on initial load
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = `${urlConfig.backendUrl}/api/gifts`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Fetch error:', error.message);
            }
        };

        fetchProducts();
    }, []);

    // Task 2: Fetch search results based on filters
    const handleSearch = async () => {
        const baseUrl = `${urlConfig.backendUrl}/api/search?`;
        const queryParams = new URLSearchParams({
            name: searchQuery,
            age_years: ageRange,
            category: selectedCategory,
            condition: selectedCondition,
        }).toString();

        try {
            const response = await fetch(`${baseUrl}${queryParams}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Failed to fetch search results:', error);
        }
    };

    // Task 6: Navigate to the details page
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    {/* Filter Section */}
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            {/* Task 3: Category Dropdown */}
                            <label htmlFor="categorySelect">Category</label>
                            <select
                                id="categorySelect"
                                className="form-control my-1"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">All</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            {/* Task 3: Condition Dropdown */}
                            <label htmlFor="conditionSelect">Condition</label>
                            <select
                                id="conditionSelect"
                                className="form-control my-1"
                                value={selectedCondition}
                                onChange={(e) => setSelectedCondition(e.target.value)}
                            >
                                <option value="">All</option>
                                {conditions.map((condition) => (
                                    <option key={condition} value={condition}>{condition}</option>
                                ))}
                            </select>

                            {/* Task 4: Age Range Slider */}
                            <label htmlFor="ageRange">Less than {ageRange} years old</label>
                            <input
                                type="range"
                                className="form-control-range"
                                id="ageRange"
                                min="1"
                                max="10"
                                value={ageRange}
                                onChange={(e) => setAgeRange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Task 7: Search Input */}
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Search for items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* Task 8: Search Button */}
                    <button className="btn btn-primary w-100" onClick={handleSearch}>Search</button>

                    {/* Task 5: Display Search Results */}
                    <div className="search-results mt-4">
                        {searchResults.length > 0 ? (
                            searchResults.map((product) => (
                                <div key={product.id} className="card mb-3">
                                    {/* Display Product Image */}
                                    {product.image ? (
                                        <img 
                                            src={process.env.PUBLIC_URL + product.image}  // Updated to load from public folder
                                            alt={product.name} 
                                            className="card-img-top" 
                                        />
                                    ) : (
                                        <div className="no-image-available text-center p-4">No Image Available</div>
                                    )}

                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">{product.description.slice(0, 100)}...</p>
                                    </div>
                                    <div className="card-footer">
                                        <button onClick={() => goToDetailsPage(product.id)} className="btn btn-primary w-100">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-info text-center" role="alert">
                                No products found. Please revise your filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
