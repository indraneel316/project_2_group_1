import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserPhotos.css';
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
    const [error, setError] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [diet, setDiet] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [allergens, setAllergens] = useState('');
    const [customIngredient, setCustomIngredient] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [showIngredients, setShowIngredients] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [selectedInstructions, setSelectedInstructions] = useState([]);
    const [activeTab, setActiveTab] = useState('photo');
    const [tabs, setTabs] = useState(['photo']);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPhotos = async () => {
            if (!user || !user.email) {
                setError('User email is missing');
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
                setError('Failed to load photos');
                console.error('Error fetching photos:', err);
            }
        };

        fetchPhotos();
    }, [user]);

    const handleCardClick = (photo) => {
        setSelectedPhoto(photo);
        setError('');
    };

    const handleCloseModal = () => {
        setSelectedPhoto(null);
        setSelectedRecipe(null);
        setError('');
    };

    const handleAnalyze = async () => {
        if (!selectedPhoto) {
            setError("No photo selected.");
            return;
        }

        setLoading(true);

        const base64Image = `data:image/jpeg;base64,${selectedPhoto}`;
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
                                    text: "Classify the given image as 'dish' or 'ingredient'. If dish: List down all the ingredients on how to make the food in the Image. No extra content. If ingredient: give the name. No extra content. Don't give me the classification type either, no extra symbols"
                                },
                                {
                                    type: 'image_url',
                                    image_url: base64Image
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
            const ingredientsList = ingredientsText
                .split("\n")
                .map(item => item.replace(/[-]*\b(dish|ingredient|ingredients)\b[:]*\s*/gi, "").trim())
                .filter(Boolean); // Filter out empty strings
            setIngredients(ingredientsList || []);
            setShowIngredients(true);

            if (!tabs.includes('analysis')) {
                setTabs(prevTabs => [...prevTabs, 'analysis']);
            }
            setActiveTab('analysis');
        } catch (err) {
            setError("Failed to fetch recipe details.");
            console.error("Error fetching recipe ingredients:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddIngredient = () => {
        if (customIngredient) {
            setIngredients(prevIngredients => [...prevIngredients, customIngredient]);
            setCustomIngredient('');
        }
    };

    const handleRemoveIngredient = (ingredient) => {
        setIngredients(ingredients.filter(item => item !== ingredient));
    };

    const handleGetRecipeSuggestions = async () => {
        setLoading(true);
        const allIngredients = [...ingredients, customIngredient].join(", ");
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
                                    text: `Suggest 5 recipes based on these ingredients: ${allIngredients}. Diet: ${diet}, Cuisine: ${cuisine}, Allergens: ${allergens}. Format the response as a list of recipes. 
                                    Each recipe should have a title and instructions. No extra content. Instructions should be line by line and it should start with Step 
                                    It should be Title: "Title Of The Recipe"
                                    Instructions: `                                }
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
            const recipesList = recipesText.split("\n\n").map(recipeText => {
                const titleMatch = recipeText.match(/Title:\s*"(.+?)"/);
                const instructionsMatch = recipeText.match(/Instructions:\s*([\s\S]+)/);

                const title = titleMatch ? titleMatch[1] : "Unknown Title";
                const instructions = instructionsMatch
                    ? instructionsMatch[1]
                        .split(/^\d+\.\s*/gm)
                        .filter(Boolean)
                        .join("\n")
                    : "No instructions available";

                return { title, instructions };
            });

            setRecipes(recipesList);

            if (!tabs.includes('recipe suggestions')) {
                setTabs(prevTabs => [...prevTabs, 'recipe suggestions']);
            }

            setActiveTab('recipe suggestions');
        } catch (err) {
            console.error("Error fetching recipe suggestions:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1 className="text-danger text-center mb-4">User Photos</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                {photos.map((photo, index) => (
                    <div className="col-md-4 mb-4 d-flex justify-content-center" key={index}>
                        <div className="card bg-danger text-white h-100 shadow" onClick={() => handleCardClick(photo)}>
                            <img
                                src={`data:image/jpeg;base64,${photo}`}
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

            {selectedPhoto && (
                <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => e.target.className.includes('modal') && handleCloseModal()}>
                    <div className="modal-dialog modal-dialog-centered modal-scrollable">
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header">
                                <h5 className="modal-title">View Photo</h5>
                                <button className="btn-close" onClick={handleCloseModal}></button>
                            </div>

                            <div className="modal-body">
                                <div className="container">
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        {tabs.map((tab, index) => (
                                            <li className="nav-item" role="presentation" key={index}>
                                                <button
                                                    className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                                    onClick={() => setActiveTab(tab)}
                                                    type="button"
                                                    role="tab">
                                                    {tab === 'photo' ? 'View Photo' : tab === 'analysis' ? 'Photo Analysis' : tab === 'recipe suggestions' ? 'Recipe Suggestions' : tab}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="tab-content mt-3">
                                        {loading && <LoadingSpinner text={activeTab === 'analysis' ? 'Fetching recipe suggestions...' : 'Analyzing Ingredients In the Photo..'} />}
                                        {!loading && (
                                            <>
                                                <div className={`tab-pane fade ${activeTab === 'photo' ? 'show active' : ''}`}>
                                                    <img
                                                        src={`data:image/jpeg;base64,${selectedPhoto}`}
                                                        alt="Selected user photo"
                                                        className="img-fluid mb-3 rounded"
                                                    />
                                                    <div className="mt-3">
                                                        <button onClick={handleAnalyze} className="btn btn-danger w-100">Analyze Photo</button>
                                                    </div>
                                                </div>

                                                <div className={`tab-pane fade ${activeTab === 'analysis' ? 'show active' : ''}`}>
                                                    {showIngredients && (
                                                        <>
                                                            <IngredientDetails ingredients={ingredients} onRemoveIngredient={handleRemoveIngredient} />
                                                            <div className="mb-3">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={customIngredient}
                                                                    onChange={(e) => setCustomIngredient(e.target.value)}
                                                                    placeholder="Add custom ingredient"
                                                                />
                                                                <button onClick={handleAddIngredient} className="btn btn-secondary mt-2 w-100">Add Ingredient</button>
                                                            </div>
                                                            <div className="mb-3">
                                                                <label className="form-label">Diet</label>
                                                                <select className="form-select" value={diet} onChange={(e) => setDiet(e.target.value)}>
                                                                    <option value="">None</option>
                                                                    <option value="vegetarian">Vegetarian</option>
                                                                    <option value="vegan">Vegan</option>
                                                                    <option value="gluten free">Gluten Free</option>
                                                                    <option value="ketogenic">Ketogenic</option>
                                                                </select>
                                                            </div>
                                                            <div className="mb-3">
                                                                <label className="form-label">Cuisine</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={cuisine}
                                                                    onChange={(e) => setCuisine(e.target.value)}
                                                                    placeholder="Cuisine Type"
                                                                />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label className="form-label">Allergens</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={allergens}
                                                                    onChange={(e) => setAllergens(e.target.value)}
                                                                    placeholder="Allergens"
                                                                />
                                                            </div>
                                                            <button onClick={handleGetRecipeSuggestions} className="btn btn-danger w-100">Get Recipe Suggestions</button>
                                                        </>
                                                    )}
                                                </div>

                                                <div className={`tab-pane fade ${activeTab === 'recipe suggestions' ? 'show active' : ''}`}>
                                                    {recipes.map((recipe, index) => ( recipe.title!=="Unknown Title" &&
                                                        <div key={index} className="p-3 bg-danger text-white rounded mb-3" style={{ cursor: 'pointer' }} onClick={() => setSelectedRecipe(recipe)}>
                                                            {recipe.title}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedRecipe && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    onClick={(e) => e.target.className.includes('modal') && setSelectedRecipe(null)}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedRecipe.title}</h5>
                                <button onClick={() => setSelectedRecipe(null)} className="btn-close"></button>
                            </div>
                            <div className="modal-body">
                                <ol className="ps-3">
                                    {selectedRecipe.instructions
                                        .split(/Step \d+:/)
                                        .filter(Boolean)
                                        .map((instruction, index) => (
                                            <p key={index} className="mb-2">
                                                <b>Step {index + 1}:  </b>    {instruction.trim()} {/* Add numbering back */}
                                            </p>
                                        ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPhotos;
