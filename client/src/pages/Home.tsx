import { FC } from 'react';
import { Link } from 'react-router-dom';

const Home: FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-8 pt-16 pb-24">
      <h1 className="text-[40px] font-bold text-black mb-3">
        Welcome to LaborCoin DAO
      </h1>
      <p className="text-[#6B7280] text-xl mb-6">
        Join our DAO by registering as a member of the voting group.
      </p>
      <Link
        to="/register"
        className="
          inline-flex px-6 py-3 
          text-base font-medium text-white 
          bg-[#2563EB] 
          rounded-xl
          hover:bg-[#1D4ED8] 
          transition-colors duration-200
        "
      >
        Register Now
      </Link>
    </div>
  );
};

export default Home;