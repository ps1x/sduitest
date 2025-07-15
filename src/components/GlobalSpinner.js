import React from 'react';

const GlobalSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
      <p>Loading Application...</p>
    </div>
  );
};

export default GlobalSpinner;
