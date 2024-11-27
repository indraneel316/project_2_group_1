import React, { useState } from 'react';

const RecipeDetails = ({ recipes, onRemoveRecipe }) => {
    const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(null); // Keep track of expanded recipe instructions

    return (
        <div className="mt-4">
            <h5>Recipe Suggestions</h5>
            <div className="d-flex flex-wrap justify-content-start">
                {recipes.length > 0 ? (
                    recipes.map((recipe, index) => (
                        <div
                            key={index}
                            className="card text-white bg-danger m-2"
                            style={{ width: '18rem', cursor: 'pointer' }}
                            onClick={() =>
                                setSelectedRecipeIndex(
                                    selectedRecipeIndex === index ? null : index
                                ) // Toggle instructions display
                            }
                        >
                            <div className="card-body">
                                {/* Title */}
                                <h5 className="card-title">{recipe.title}</h5>

                                {/* Instructions (conditionally rendered per title click) */}
                                {selectedRecipeIndex === index && (
                                    <ol className="ps-3 mt-3">
                                        {recipe.instructions
                                            .split(/Step \d+:/) // Split instructions into individual steps
                                            .filter(Boolean)
                                            .map((instruction, i) => (
                                                <li
                                                    key={i}
                                                    className="mb-2 text-white"
                                                    style={{
                                                        fontSize: '0.9rem',
                                                    }}
                                                >
                                                    {instruction.trim()}
                                                </li>
                                            ))}
                                    </ol>
                                )}

                                {/* Remove Button */}
                                <button
                                    className="btn btn-dark mt-2 w-100"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent toggling instructions on click
                                        onRemoveRecipe(recipe);
                                    }}
                                >
                                    Remove Recipe
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No recipes available for this photo.</p>
                )}
            </div>
        </div>
    );
};

export default RecipeDetails;
