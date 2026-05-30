import React from 'react';

const Card = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`bg-white border border-slate-200 shadow-sm rounded-2xl ${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
