import React from 'react';
import Header from '../../components/Header/Header';

const Search: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold">Search</h1>
        <p className="mt-4 text-lg">Search for products here.</p>
      </div>
    </>
  );
};

export default Search;