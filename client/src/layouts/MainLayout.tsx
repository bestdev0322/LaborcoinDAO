import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutProps } from '../types';

const MainLayout: FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/proposals', label: 'Proposals' },
    { path: '/wallet', label: 'My Wallet' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold mr-8">
                LaborCoin DAO
              </Link>
              <div className="hidden md:flex space-x-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === link.path
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <Link
                to="/register"
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/register'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;