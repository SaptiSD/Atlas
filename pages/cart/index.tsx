import React from 'react';
import Header from '../../app/client/components/Header/Header';

const Cart: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold">Cart</h1>
        <p className="mt-4 text-lg">Items in your cart will appear here.</p>
      </div>
    </>
  );
};

export default Cart;
