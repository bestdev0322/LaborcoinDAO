import { Link } from 'react-router-dom';

export default function Home() {
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
      >
        <p className="inline-block p-3 bg-blue-500 text-white text-base rounded hover:bg-blue-600 transition-colors">Register Now</p>
      </Link>
    </div>
  );
}