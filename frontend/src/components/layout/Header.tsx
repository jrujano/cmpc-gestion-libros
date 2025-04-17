import { useAuth } from '../../context/AuthContext';



type HeaderProps = {
  setSidebarOpen: (open: boolean) => void;
};

const Header = ({ setSidebarOpen }: HeaderProps) => {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 bg-white shadow px-4 py-3 flex items-center justify-between md:ml-64">
      {/* Hamburger menu (mobile) */}
      <button
        className="md:hidden text-gray-500 hover:text-gray-700"
        onClick={() => setSidebarOpen(true)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 className="text-xl font-semibold">CMPC</h1>
      <h2> {user?.name}</h2>
    </header>
  );
};

export default Header;
