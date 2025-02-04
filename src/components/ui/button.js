import React from 'react';

const Button = ({ children, onClick, variant = 'default', disabled = false, className = '' }) => {
  const buttonStyles = {
    default: 'bg-blue-500 hover:bg-blue-600 text-white',
    outline: 'border border-gray-400 text-gray-700 hover:bg-gray-100',
  };

  return (
    <button
      className={`px-4 py-2 rounded-md ${buttonStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
