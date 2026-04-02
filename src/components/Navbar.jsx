import React from 'react';

const Navbar = ({ setPage }) => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-red-600 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('home')}>
          <Droplet className="fill-current text-white" size={32} />
          <span className="text-2xl font-bold tracking-tighter">BLOODFLOW</span>
        </div>
        <div className="hidden md:flex gap-6 items-center font-medium">
          <button onClick={() => setPage('requests')} className="hover:text-red-200">Donation Requests</button>
          {!user ? (
            <>
              <button onClick={() => setPage('login')} className="bg-white text-red-600 px-4 py-1 rounded-full font-bold">Login</button>
              <button onClick={() => setPage('register')} className="border-2 border-white px-4 py-1 rounded-full font-bold">Register</button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <button onClick={() => setPage('funding')} className="hover:text-red-200">Funding</button>
              <div className="group relative">
                <img 
                  src="https://ui-avatars.com/api/?name=User" 
                  className="w-10 h-10 rounded-full border-2 border-white cursor-pointer" 
                  alt="Profile"
                />
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-2xl hidden group-hover:block border animate-in fade-in zoom-in duration-200">
                  <div className="p-3 border-b text-sm font-bold text-red-600">{user.name}</div>
                  <button onClick={() => setPage('dashboard')} className="block w-full text-left px-4 py-2 hover:bg-red-50">Dashboard</button>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 border-t">Logout</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
