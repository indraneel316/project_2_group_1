import React from 'react';

const IngredientDetails = ({ ingredients, onRemoveIngredient }) => {
    return (
        <div className="mt-4">
            <h5>Recipe Ingredients</h5>
            <div className="d-flex flex-wrap justify-content-start">
                {ingredients.length > 0 ? (
                    ingredients.map((ingredient, index) => (
                        <button
                            key={index}
                            className="btn btn-outline-light m-2 position-relative"
                            style={{
                                paddingRight: '2rem', // Ensures room for "X"
                                paddingLeft: '1rem', // Adds some space before the text
                            }}
                        >
                            {ingredient}

                            <span
                                className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger"
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    padding: '0.1rem 0.5rem',
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent button click event
                                    onRemoveIngredient(ingredient);
                                }}
                            >
                                &times;
                            </span>
                        </button>
                    ))
                ) : (
                    <p>No ingredients available for this photo.</p>
                )}
            </div>
        </div>
    );
};

export default IngredientDetails;
