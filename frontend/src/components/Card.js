import React from 'react';

export const Card = ({ title, description, buttonText, onClick }) => {
    return (
        <div className="card">
            <h2>{title}</h2>
            <p>{description}</p>
            <button onClick={onClick}>{buttonText}</button>
        </div>
    );
};

export default Card;
