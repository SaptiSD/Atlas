import React from 'react';
import Header from '../../app/client/components/Header/Header';

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold">Home</h1>
        <p className="mt-4 text-lg">This is the homepage of your Next.js application.</p>
      </div>
    </>
  );
};

export default Home;
