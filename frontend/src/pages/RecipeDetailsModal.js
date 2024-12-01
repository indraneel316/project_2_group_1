import React from 'react';

const RecipeDetailsModal = ({ recipe, onClose }) => (
    <div
        className="modal fade show d-block"
        tabIndex="-1"
        onClick={(e) => e.target.className.includes('modal') && onClose()}
    >
        <div className="modal-dialog modal-dialog-centered modal-scrollable">
            <div className="modal-content bg-dark text-white">
                <div className="modal-header">
                    <h5 className="modal-title">{recipe.title}</h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>
                <div className="modal-body">
                    {recipe.instructions
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
);

export default RecipeDetailsModal;
