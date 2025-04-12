import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex justify-between h-[60px]">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-black">
              LaborCoin DAO
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              to="/register"
              className="text-black text-base"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}