import { FC } from 'react';
import { Link } from 'react-router-dom';
import { LayoutProps } from '../types';

const MainLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold">
                LaborCoin DAO
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                to="/register"
                className="text-gray-900 text-base font-medium"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;