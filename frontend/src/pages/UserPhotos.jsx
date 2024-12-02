import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import PhotoCard from './PhotoCard';
import ModalTabs from './ModalTabs';
import TabContent from './TabContent';
import RecipeDetailsModal from './RecipeDetailsModal';
import CustomUpload from './CustomUpload';
import './UserPhotos.css';
import RemoveConfirmationModal from "./RemoveConfirmationModal";

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
    const [suggestedRecipes, setSuggestedRecipes] = useState([]);
    const [photoToRemoveUrl, setPhotoToRemoveUrl] = useState(null);
    const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);


    // Fetch photos from backend
    useEffect(() => {
        const fetchPhotos = async () => {
            if (!user || !user.email) {
                setError('User email is missing.');
                return;
            }
            try {
                const response = await axios.get('http://localhost:5000/backend/api/users/photos', {
                    params: { email: user.email },
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setPhotos(response.data.photos);
            } catch (err) {
                setError('Failed to load photos.');
                console.error('Error fetching photos:', err);
            }
        };

        fetchPhotos();
    }, [user]);

    // Fetch saved photo data
    useEffect(() => {
        const fetchSavedPhotoData = async () => {
            if (!user || !user.email) return;
            try {
                const response = await axios.get('http://localhost:5000/backend/api/users/retrieve-results', {
                    params: { email: user.email },
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                if (response.status === 200 && response.data.photoData) {
                    setPhotoData(response.data.photoData[0]); // Assuming structured response
                } else {
                    setPhotoData({});
                }
            } catch (err) {
                console.error('Error fetching saved photo data:', err);
            }
        };

        fetchSavedPhotoData();
    }, [user]);

    // Update local photoData
    const updatePhotoData = (photoUrl, update) => {
        setPhotoData((prevState) => ({
            ...prevState,
            [photoUrl]: {
                ...prevState[photoUrl],
                ...update,
            },
        }));
    };

    const handlePhotoRemoveRequest = (photoUrl) => {
        setPhotoToRemoveUrl(photoUrl);
        setShowRemoveConfirmation(true);
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
            const response = await axios.post('http://localhost:5000/backend/api/users/save-results', {
                email: user.email,
                photoData,
            }, {
                headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
            });

            if (response.status >= 200 && response.status < 300) {
                setError('');
            } else {
                setError('Failed to save photo data.');
            }
        } catch (err) {
            setError('Failed to save photo data.');
            console.error('Error saving photo data:', err.response?.data || err.message);
        }
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
                                    text: "Classify the given image as 'dish' or 'ingredient'. If dish: LIST down all the ingredients(line by line) on how to make the food in the Image. No extra content. If ingredient: give the name. No EXTRA CONTENT. Don't give me the classification type either, no extra symbols."
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
            setCustomIngredient(''); // Reset the input field after adding
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


    const handleCardClick = (photoUrl) => {
        setSelectedPhotoUrl(photoUrl);
        setActiveTab(photoData[photoUrl]?.activeTab || 'photo');
    };

    const removePhoto = async () => {
        try {
            if (!photoToRemoveUrl || !user?.email) return;

            const response = await axios.delete(`http://localhost:5000/backend/api/users/remove-photo`, {
                data: {
                    email: user.email,
                    photoUrl: photoToRemoveUrl,
                },
                headers: { Authorization: `Bearer ${user.token}` },
            });

            if (response.status === 200) {
                // Update the local state to remove the photo
                setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo !== photoToRemoveUrl));
                setError("");
            } else {
                setError("Failed to remove photo.");
            }
        } catch (err) {
            setError("Failed to remove photo.");
            console.error("Error removing photo:", err.response?.data || err.message);
        } finally {
            setShowRemoveConfirmation(false);
            setPhotoToRemoveUrl(null);
        }
    };

    const handleCloseModal = () => {
        setSelectedPhotoUrl(null);
        setActiveTab('photo');
        setError('');
    };

    const selectedPhotoData = selectedPhotoUrl ? photoData[selectedPhotoUrl] || {} : {};
    const ingredients = selectedPhotoData.ingredients || [];
    const recipes = selectedPhotoData.recipes || [];
    const tabs = selectedPhotoData.tabs || ['photo'];
    const tabsnew = ['photo', 'analysis', 'recipe suggestions']

    return (
        <div className="container">
            <div id="div1" className='myindexing'>
            <h1 className="text-white text-center mb-4">Review Your Food Photos</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Photo Grid */}
            <div className="row">
                {photos.map((photoUrl, index) => (
                    <PhotoCard key={index} photoUrl={photoUrl} index={index} onClick={handleCardClick} onRemove={handlePhotoRemoveRequest}/>
                ))}
            </div>

            <RemoveConfirmationModal
                show={showRemoveConfirmation}
                onClose={() => setShowRemoveConfirmation(false)}
                onConfirm={removePhoto}
            />
            </div>

            {/* Modal for Photo Details */}
            {selectedPhotoUrl && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-scrollable">
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header">
                                <h5 className="modal-title">Photo Details</h5>
                                <button className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <ModalTabs tabsnew={tabs} activeTab={activeTab} onChangeTab={setActiveTab} />
                                <TabContent
                                    activeTab={activeTab}
                                    selectedPhotoUrl={selectedPhotoUrl}
                                    ingredients={ingredients}
                                    customIngredient={customIngredient}
                                    setCustomIngredient={setCustomIngredient}
                                    onAddIngredient={handleAddIngredient}
                                    onRemoveIngredient={handleRemoveIngredient}
                                    onAnalyze={handleAnalyze}
                                    loading={loading}
                                    diet={diet}
                                    cuisine={cuisine}
                                    allergens={allergens}
                                    setDiet={setDiet}
                                    setCuisine={setCuisine}
                                    setAllergens={setAllergens}
                                    onGetRecipeSuggestions={handleGetRecipeSuggestions}
                                    recipes={recipes}
                                    onSave={handleSave}
                                    setSelectedRecipe={setSelectedRecipe}
                                    />

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recipe Details Modal */}
            {selectedRecipe && (
                <RecipeDetailsModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
            )}

            {/* Upload Section */}
            <CustomUpload onUploadComplete={handleUploadComplete} />
        </div>
    );
};

export default UserPhotos;
