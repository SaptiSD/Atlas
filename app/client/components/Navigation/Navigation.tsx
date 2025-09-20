import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-gray-100 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-blue-500 hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link to="/search" className="text-blue-500 hover:underline">
            Search
          </Link>
        </li>
        <li>
          <Link to="/cart" className="text-blue-500 hover:underline">
            Cart
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;