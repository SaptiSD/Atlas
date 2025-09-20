import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white p-4">
      <h1 className="text-2xl font-bold">Atlas</h1>
      <nav className="mt-2">
        <ul className="flex space-x-4">
          <li>
            <Link href="/home" className="hover:underline">Home</Link>
          </li>
          <li>
            <Link href="/search" className="hover:underline">Search</Link>
          </li>
          <li>
            <Link href="/cart" className="hover:underline">Cart</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;