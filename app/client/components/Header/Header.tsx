import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white p-4">
      <h1 className="text-2xl font-bold">Atlas</h1>
      <nav className="mt-2">
        <ul className="flex space-x-4">
          <li>
            <Link href="/home">
              <a className="hover:underline">Home</a>
            </Link>
          </li>
          <li>
            <Link href="/search">
              <a className="hover:underline">Search</a>
            </Link>
          </li>
          <li>
            <Link href="/cart">
              <a className="hover:underline">Cart</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;