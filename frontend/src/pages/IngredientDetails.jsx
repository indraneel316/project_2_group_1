import React from 'react';

const IngredientDetails = ({ ingredients, onRemoveIngredient }) => {
    return (
        <div className="mt-4">
            <h5>Recipe Ingredients</h5>
            <div className="d-flex flex-wrap gap-3">
                {ingredients.length > 0 ? (
                    ingredients.map((ingredient, index) => (
                        <div
                            key={index}
                            className="position-relative ingredient-card"
                            style={{
                                display: 'inline-block',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '0.5rem 1rem',
                                // backgroundColor: '#fff',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                minWidth: '150px',
                                textAlign: 'center',
                                position: 'relative',
                                fontSize: '0.9rem',
                            }}
                        >
                            <span>{ingredient}</span>

                            <span
                                className="position-absolute remove-badge"
                                style={{
                                    top: '-8px',
                                    right: '-8px',
                                    cursor: 'pointer',
                                    color: '#fff',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    background: '#e74c3c',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent button click event
                                    onRemoveIngredient(ingredient);
                                }}
                            >
                                &times;
                            </span>
                        </div>
                    ))
                ) : (
                    <p>No ingredients available for this photo.</p>
                )}
            </div>
        </div>
    );
};

export default IngredientDetails;
