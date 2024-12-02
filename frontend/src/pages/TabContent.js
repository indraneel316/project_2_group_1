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

    // Helper function to check if all recipes have "No instructions available"
    const areAllRecipesUnavailable = (recipes) => {
        return recipes.every(
            (recipe) =>
                recipe.instructions === 'No instructions available'
        );
    };

    if (loading) return <LoadingSpinner text="Loading..." />;

    return (
        <div>
            {/* Tab Content */}
            <div>
                {activeTab === 'photo' && (
                    <div className="photoclass">
                        {selectedPhotoUrl ? (
                            <div>
                                <img
                                    src={selectedPhotoUrl}
                                    alt="Selected user photo"
                                    className="img-fluid mb-3 rounded cmh"
                                />
                                <button
                                    className="btn btn-danger w-100"
                                    onClick={onAnalyze}
                                >
                                    Analyze Photo
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p>No photo selected. Please select a photo to view.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'analysis' && (
                    <div>
                        {ingredients.length > 0 && (
                            <IngredientDetails
                                ingredients={ingredients}
                                onRemoveIngredient={onRemoveIngredient}
                            />
                        )}
                        <input
                            type="text"
                            className="form-control cus-m"
                            placeholder="Add custom ingredient"
                            value={customIngredient}
                            onChange={(e) =>
                                setCustomIngredient(e.target.value)
                            }
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
                                    <option value="vegetarian">
                                        Vegetarian
                                    </option>
                                    <option value="vegan">Vegan</option>
                                    <option value="gluten free">
                                        Gluten Free
                                    </option>
                                    <option value="ketogenic">
                                        Ketogenic
                                    </option>
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
                                    onChange={(e) =>
                                        setAllergens(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <button
                            className="btn btn-danger mt-3 w-100"
                            onClick={onGetRecipeSuggestions}
                        >
                            Get Recipe Suggestions
                        </button>
                    </div>
                )}

                {activeTab === 'recipe suggestions' && (
                    <div className="cus-m">
                        {recipes.length > 0 && !areAllRecipesUnavailable(recipes) ? (
                            recipes.map(
                                (recipe, index) =>
                                    recipe.instructions !==
                                        'No instructions available' && (
                                        <div
                                            key={index}
                                            className="p-3 bg-danger text-white rounded mb-3"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() =>
                                                setSelectedRecipe(recipe)
                                            }
                                        >
                                            <strong>{recipe.title}</strong>
                                        </div>
                                    )
                            )
                        ) : (
                            <div className="text-center" >
                                <p>No recipes available. Try analyzing a photo and adding ingredients.</p>
                            </div>
                        )}

                        {recipes.length > 0 && !areAllRecipesUnavailable(recipes) && (
                            <button
                                className={`btn ${
                                    saveState === 'saved'
                                        ? 'btn1'
                                        : 'btn2'
                                } w-100 mt-3`}
                                onClick={handleSaveClick}
                                disabled={
                                    saveState === 'saving' ||
                                    saveState === 'saved'
                                } // Disable during saving or saved state
                            >
                                {saveState === 'saving'
                                    ? 'Saving...'
                                    : saveState === 'saved'
                                    ? 'Saved!'
                                    : 'Save'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TabContent;
