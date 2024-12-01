import React, { useState } from 'react';
import IngredientDetails from './IngredientDetails';
import LoadingSpinner from './LoadingSpinner';
import './TabContent.css';

const TabContent = ({
    activeTab,
    selectedPhotoUrl,
    ingredients,
    customIngredient,
    setCustomIngredient,
    onAddIngredient,
    onRemoveIngredient,
    onAnalyze,
    loading,
    diet,
    cuisine,
    allergens,
    setDiet,
    setCuisine,
    setAllergens,
    onGetRecipeSuggestions,
    recipes,
    // suggestedRecipes,
    onSave,
    setSelectedRecipe,
}) => {
    const [saveState, setSaveState] = useState('idle');

    const handleSaveClick = async () => {
        setSaveState('saving');
        try {
            await onSave();
            setSaveState('saved');
        } catch (error) {
            setSaveState('idle');
            console.error('Save failed:', error);
        }
    };

    if (loading) return <LoadingSpinner text="Loading..." />;

    if (activeTab === 'photo') {
        return (
            <div>
                <img
                    src={selectedPhotoUrl}
                    alt="Selected user photo"
                    className="img-fluid mb-3 rounded"
                />
                <button className="btn btn-danger w-100" onClick={onAnalyze}>
                    Analyze Photo
                </button>
            </div>
        );
    }

    if (activeTab === 'analysis') {
        return (
            <div>
                    <>
                        {ingredients.length > 0 && ( <IngredientDetails
                            ingredients={ingredients}
                            onRemoveIngredient={onRemoveIngredient}
                        />)}
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Add custom ingredient"
                            value={customIngredient}
                            onChange={(e) => setCustomIngredient(e.target.value)}
                        />
                        <button
                            className="btn btn-secondary mt-2 w-100"
                            onClick={onAddIngredient}
                        >
                            Add Ingredient
                        </button>
                        <hr />
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
                            onClick={onGetRecipeSuggestions}
                        >
                            Get Recipe Suggestions
                        </button>
                    </>

            </div>
        );
    }

    if (activeTab === 'recipe suggestions') {
        return (
            <div>
                {recipes.map((recipe, index) => (
// recipe.title !== "Unknown Title"
                    <div
                        key={index}
                        className="p-3 bg-danger text-white rounded mb-3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedRecipe(recipe)}
                    >
                        <strong>{recipe.title}</strong>
                    </div>
                ))}

                <button
                    className={`btn ${saveState === 'saved' ? 'btn-primary' : 'btn-success'} w-100 mt-3`}
                    onClick={handleSaveClick}
                    disabled={saveState === 'saving'}
                >
                    {saveState === 'saving'
                        ? 'Saving...'
                        : saveState === 'saved'
                        ? 'Saved!'
                        : 'Save'}
                </button>
            </div>
        );
    }
};


export default TabContent;
