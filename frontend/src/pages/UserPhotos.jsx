import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserPhotos.css';
import CustomUpload from './CustomUpload';
import IngredientDetails from './IngredientDetails';

const LoadingSpinner = ({ text }) => (
    <div className="text-center my-5">
        <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-white">{text}</p>
    </div>
);

const UserPhotos = () => {
    const { user } = useContext(UserContext);
    const [photos, setPhotos] = useState([]);
    const [photoData, setPhotoData] = useState({});
    const [error, setError] = useState('');
    const [selectedPhotoUrl, setSelectedPhotoUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [customIngredient, setCustomIngredient] = useState('');
    const [diet, setDiet] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [allergens, setAllergens] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [activeTab, setActiveTab] = useState('photo');

    // Fetch photos on component mount
    useEffect(() => {
        const fetchPhotos = async () => {
            if (!user || !user.email) {
                setError('User email is missing.');
                return;
            }
            try {
                const response = await axios.get('http://localhost:5000/backend/api/users/photos', {
                    params: { email: user.email },
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setPhotos(response.data.photos);
            } catch (err) {
                setError('Failed to load photos.');
                console.error('Error fetching photos:', err);
            }
        };

        fetchPhotos();
    }, [user]);

    // Fetch existing photo data from backend
    useEffect(() => {
        const fetchSavedPhotoData = async () => {
            if (!user || !user.email) return;
            try {
                const response = await axios.get('http://localhost:5000/backend/api/users/retrieve-results', {
                    params: { email: user.email },
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (response.status === 200 && response.data.photoData) {
                    // Initialize photoData state with existing results
                    setPhotoData(response.data.photoData[0]); // Assuming correct structured response
                } else {
                    setPhotoData({});
                }
            } catch (err) {
                console.error('Error fetching saved photo data:', err);
            }
        };

        fetchSavedPhotoData();
    }, [user]);

    // Update local photoData with url as key
    const updatePhotoData = (photoUrl, update) => {
        setPhotoData((prevState) => ({
            ...prevState,
            [photoUrl]: {
                ...prevState[photoUrl],
                ...update,
            },
        }));
    };

    const handleUploadComplete = (newPhotosArray) => {
        setPhotos(newPhotosArray);
        setError('');
    };

    const handleSave = async () => {
        if (!user || !Object.keys(photoData).length) {
            setError('No photo or user information available.');
            return;
        }

        try {
            const dataToSend = {
                email: user.email,
                photoData,
            };
            const response = await axios.post('http://localhost:5000/backend/api/users/save-results', dataToSend, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status >= 200 && response.status < 300) {
                setError('');
                handleCloseModal();
            } else {
                setError('Failed to save photo data.');
            }
        } catch (err) {
            setError('Failed to save photo data.');
            console.error('Error saving photo data:', err.response?.data || err.message);
        }
    };

    const handleCardClick = (photoUrl) => {
        setSelectedPhotoUrl(photoUrl);
        setActiveTab(photoData[photoUrl]?.activeTab || 'photo');
    };

    const handleCloseModal = () => {
        setSelectedPhotoUrl(null);
        setActiveTab('photo');
        setError('');
    };

    const handleAnalyze = async () => {
        if (!selectedPhotoUrl) {
            setError('No photo selected.');
            return;
        }
        setLoading(true);

        const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
        try {
            const response = await axios.post(
                API_URL,
                {
                    model: 'openai/gpt-4o',
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: "Classify the given image as 'dish' or 'ingredient'. If dish: LIST down all the ingredients on how to make the food in the Image. No extra content. If ingredient: give the name. No EXTRA CONTENT. Don't give me the classification type either, no extra symbols."
                                },
                                {
                                    type: 'image_url',
                                    image_url: selectedPhotoUrl
                                }
                            ]
                        }
                    ]
                },
                {
                    headers: {
                        Authorization: `Bearer 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`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const ingredientsText = response.data.choices[0].message.content;
            const ingredientsList = ingredientsText.split('\n').map((item) => item.trim()).filter(Boolean);

            // Update the photoData to include 'photo' in tabs
            updatePhotoData(selectedPhotoUrl, {
                ingredients: ingredientsList,
                tabs: Array.from(new Set([
                    'photo', // Ensure 'photo' is always included
                    ...(photoData[selectedPhotoUrl]?.tabs || []),
                    'analysis'
                ])),
                activeTab: 'analysis',
            });
            setActiveTab('analysis');
        } catch (err) {
            setError('Failed to analyze photo.');
            console.error('Error analyzing photo:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };





    const handleAddIngredient = () => {
        if (customIngredient && selectedPhotoUrl) {
            updatePhotoData(selectedPhotoUrl, {
                ingredients: [
                    ...(photoData[selectedPhotoUrl]?.ingredients || []),
                    customIngredient,
                ],
            });
            setCustomIngredient('');
        }
    };

    const handleRemoveIngredient = (ingredient) => {
        if (selectedPhotoUrl) {
            updatePhotoData(selectedPhotoUrl, {
                ingredients: photoData[selectedPhotoUrl]?.ingredients?.filter((i) => i !== ingredient),
            });
        }
    };

    const handleGetRecipeSuggestions = async () => {
        if (!selectedPhotoUrl || !photoData[selectedPhotoUrl]?.ingredients?.length) {
            setError('No ingredients available to suggest recipes.');
            return;
        }

        setLoading(true);
        const allIngredients = photoData[selectedPhotoUrl]?.ingredients.join(', ');
        const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
        try {
            const response = await axios.post(
                API_URL,
                {
                    model: 'openai/gpt-4o',
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: `Suggest 5 recipes based on these ingredients: ${allIngredients}. Diet: ${diet}, Cuisine: ${cuisine}, Allergens: ${allergens}. Format the response as a list of recipes. Each recipe should have a title and instructions. No extra content. Instructions should be line by line and it should start with Step. It should be Title: "Title Of The Recipe" Instructions: `
                                },
                            ]
                        }
                    ]
                },
                {
                    headers: {
                        Authorization: `Bearer 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`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const recipesText = response.data.choices[0].message.content;
            const recipesList = recipesText.split('\n\n').map((recipeText) => {
                const titleMatch = recipeText.match(/Title:\s*"(.+?)"/);
                const instructionsMatch = recipeText.match(/Instructions:\s*([\s\S]+)/);
                return {
                    title: titleMatch ? titleMatch[1] : 'Unknown Title',
                    instructions: instructionsMatch ? instructionsMatch[1].trim() : 'No instructions available',
                };
            });

            updatePhotoData(selectedPhotoUrl, {
                recipes: recipesList,
                tabs: Array.from(new Set([...(photoData[selectedPhotoUrl]?.tabs || []), 'recipe suggestions'])),
                activeTab: 'recipe suggestions',
            });
            setActiveTab('recipe suggestions');
        } catch (err) {
            setError('Failed to fetch recipe suggestions.');
            console.error('Error fetching recipes:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const selectedPhotoData = selectedPhotoUrl ? photoData[selectedPhotoUrl] || {} : {};
    const ingredients = selectedPhotoData.ingredients || [];
    const recipes = selectedPhotoData.recipes || [];
    const tabs = selectedPhotoData.tabs || ['photo'];

    return (
        <div className="container">
            <h1 className="text-danger text-center mb-4">Review Your Food Photos</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* List of Photos */}
            <div className="row">
                {photos.map((photoUrl, index) => (
                    <div className="col-md-4 mb-4 d-flex justify-content-center" key={index}>
                        <div
                            className="card bg-danger text-white h-100 shadow"
                            onClick={() => handleCardClick(photoUrl)}
                        >
                            <img
                                src={photoUrl}
                                alt={`User photo ${index + 1}`}
                                className="card-img-top consistent-img"
                            />
                            <div className="card-body d-flex flex-column justify-content-between">
                                <h5 className="card-title">Photo {index + 1}</h5>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedPhotoUrl && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    onClick={(e) => e.target.className.includes('modal') && handleCloseModal()}
                >
                    <div className="modal-dialog modal-dialog-centered modal-scrollable">
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header">
                                <h5 className="modal-title">Photo Details</h5>
                                <button className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                {/* Tabs */}
                                <ul className="nav nav-tabs">
                                    {tabs.map((tab, index) => (
                                        <li className="nav-item" key={index}>
                                            <button
                                                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                                onClick={() => setActiveTab(tab)}
                                            >
                                                {tab === 'photo' ? 'View Photo'
                                                    : tab === 'analysis' ? 'Photo Analysis'
                                                        : 'Recipe Suggestions'}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                {/* Tab Content */}
                                <div className="tab-content mt-3">
                                    {loading && <LoadingSpinner text="Loading..." />}
                                    {!loading &&
                                        <>
                                            {/* Tab: Photo */}
                                            {activeTab === 'photo' && (
                                                <div>
                                                    <img
                                                        src={selectedPhotoUrl}
                                                        alt="Selected user photo"
                                                        className="img-fluid mb-3 rounded"
                                                    />
                                                    <button className="btn btn-danger w-100" onClick={handleAnalyze}>
                                                        Analyze Photo
                                                    </button>
                                                </div>
                                            )}

                                            {/* Tab: Analysis */}
                                            {activeTab === 'analysis' && (
                                                <div>
                                                    {ingredients.length > 0 && (
                                                        <>
                                                            <IngredientDetails
                                                                ingredients={ingredients}
                                                                onRemoveIngredient={handleRemoveIngredient}
                                                            />
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Add custom ingredient"
                                                                value={customIngredient}
                                                                onChange={(e) => setCustomIngredient(e.target.value)}
                                                            />
                                                            <button
                                                                className="btn btn-secondary mt-2 w-100"
                                                                onClick={handleAddIngredient}
                                                            >
                                                                Add Ingredient
                                                            </button>
                                                            <hr />
                                                            {/* Recipe Filters */}
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <label>Diet</label>
                                                                    <select
                                                                        className="form-select"
                                                                        value={diet}
                                                                        onChange={(e) => setDiet(e.target.value)}
                                                                    >
                                                                        <option value="">None</option>
                                                                        <option value="vegetarian">Vegetarian</option>
                                                                        <option value="vegan">Vegan</option>
                                                                        <option value="gluten free">Gluten Free</option>
                                                                        <option value="ketogenic">Ketogenic</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label>Cuisine</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Cuisine Type"
                                                                        value={cuisine}
                                                                        onChange={(e) => setCuisine(e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label>Allergens</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Allergens"
                                                                        value={allergens}
                                                                        onChange={(e) => setAllergens(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <button
                                                                className="btn btn-danger mt-3 w-100"
                                                                onClick={handleGetRecipeSuggestions}
                                                            >
                                                                Get Recipe Suggestions
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {/* Tab: Recipe Suggestions */}
                                            {activeTab === 'recipe suggestions' && (
                                                <div>
                                                    {recipes.map((recipe, index) => (
                                                        recipe.title !== 'Unknown Title' &&
                                                        <div
                                                            key={index}
                                                            className="p-3 bg-danger text-white rounded mb-3"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => setSelectedRecipe(recipe)}
                                                        >
                                                            <strong>{recipe.title}</strong>
                                                        </div>
                                                    ))}
                                                    <div className="d-flex justify-content-between mt-4">
                                                        <button className="btn btn-success" onClick={handleSave}>Save</button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recipe Details Modal */}
            {selectedRecipe && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    onClick={(e) => e.target.className.includes('modal') && setSelectedRecipe(null)}
                >
                    <div className="modal-dialog modal-dialog-centered modal-scrollable">
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedRecipe.title}</h5>
                                <button className="btn-close" onClick={() => setSelectedRecipe(null)}></button>
                            </div>
                            <div className="modal-body">
                                {selectedRecipe.instructions
                                    .split(/(?:Step\s+[0-9]+:\s*)/i)
                                    .filter(Boolean)
                                    .map((instruction, index) => (
                                        <p key={index}>
                                            <b>Step {index + 1}: </b> {instruction.trim()}
                                        </p>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <CustomUpload onUploadComplete={handleUploadComplete} />
        </div>
    );
};

export default UserPhotos;
