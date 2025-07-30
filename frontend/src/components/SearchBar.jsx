import React from 'react';

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <input
      type="text"
      placeholder="Search DEF CON gear..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        width: '100%',
        padding: '0.5rem',
        marginBottom: '2rem',
        background: '#111',
        color: '#0f0',
        border: '1px solid #0f0'
      }}
    />
  );
}
