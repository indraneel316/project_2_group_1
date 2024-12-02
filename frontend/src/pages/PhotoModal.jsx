// import React, { useState } from 'react';
// import './PhotoModal.css';

// const PhotoModal = ({ photoUrl, photoData, setSelectedPhotoUrl, updatePhotoData }) => {
//     const [customIngredient, setCustomIngredient] = useState('');

//     const handleClose = () => setSelectedPhotoUrl(null);

//     const handleAddIngredient = () => {
//         if (customIngredient) {
//             updatePhotoData(photoUrl, {
//                 ingredients: [
//                     ...(photoData.ingredients || []),
//                     customIngredient,
//                 ],
//             });
//             setCustomIngredient('');
//         }
//     };

//     return (
//         <div className="modal fade show d-block" tabIndex="-1">
//             <div className="modal-dialog modal-dialog-centered modal-scrollable">
//                 <div className="modal-content modal-dark">
//                     <div className="modal-header">
//                         <h5 className="modal-title">Photo Details</h5>
//                         <button className="btn-close" onClick={handleClose}></button>
//                     </div>
//                     <div className="modal-body">
//                         <img
//                             src={photoUrl}
//                             alt="Selected user photo"
//                             className="modal-photo"
//                         />
//                         {photoData.ingredients && (
//                             <>
//                                 <div className="ingredient-list">
//                                     {photoData.ingredients.map((ingredient, idx) => (
//                                         <span key={idx} className="ingredient-badge">{ingredient}</span>
//                                     ))}
//                                 </div>
//                                 <input
//                                     type="text"
//                                     className="form-control custom-input cus-margin"
//                                     placeholder="Add custom ingredient"
//                                     value={customIngredient}
//                                     onChange={(e) => setCustomIngredient(e.target.value)}
//                                     style={{ marginTop: '1rem' }} // Add margin-top directly here
//                                 />
//                                 <button
//                                     className="btn btn-secondary mt-3 w-100"
//                                     onClick={handleAddIngredient}
//                                 >
//                                     Add Ingredient
//                                 </button>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PhotoModal;
