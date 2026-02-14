import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import { LogOut, Menu, X, Bell, User } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-200 dark:border-gray-700">
             <div className="font-bold text-xl text-primary">Admin Panel</div>
             <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <X size={20} />
             </button>
        </div>
        
        <nav className="p-4 space-y-1">
          {/* Navigation Links */}
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => clsx(
              "block px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors",
              isActive 
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            onClick={() => setIsSidebarOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/products" 
            className={({ isActive }) => clsx(
              "block px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors",
              isActive 
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            onClick={() => setIsSidebarOpen(false)}
          >
            Products
          </NavLink>
          <NavLink 
            to="/categories" 
            className={({ isActive }) => clsx(
              "block px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors",
              isActive 
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            onClick={() => setIsSidebarOpen(false)}
          >
            Categories
          </NavLink>
          <NavLink 
            to="/sub-categories" 
            className={({ isActive }) => clsx(
              "block px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors",
              isActive 
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            onClick={() => setIsSidebarOpen(false)}
          >
            Sub Categories
          </NavLink>
          <NavLink 
            to="/brands" 
            className={({ isActive }) => clsx(
              "block px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors",
              isActive 
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            onClick={() => setIsSidebarOpen(false)}
          >
            Brands
          </NavLink>
          <NavLink 
            to="/variant-types" 
            className={({ isActive }) => clsx(
              "block px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors",
              isActive 
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            onClick={() => setIsSidebarOpen(false)}
          >
            Variant Types
          </NavLink>
          <NavLink 
            to="/variants" 
            className={({ isActive }) => clsx(
              "block px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors",
              isActive 
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            onClick={() => setIsSidebarOpen(false)}
          >
            Variants
          </NavLink>
          <NavLink 
            to="/coupons" 
            className={({ isActive }) => clsx(
              "block px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors",
              isActive 
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            onClick={() => setIsSidebarOpen(false)}
          >
            Coupons
          </NavLink>
          <NavLink 
            to="/posters" 
            className={({ isActive }) => clsx(
              "block px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors",
              isActive 
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            onClick={() => setIsSidebarOpen(false)}
          >
            Posters
          </NavLink>
          <NavLink 
            to="/notifications" 
            className={({ isActive }) => clsx(
              "block px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors",
              isActive 
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            onClick={() => setIsSidebarOpen(false)}
          >
            Notifications
          </NavLink>
          <NavLink 
            to="/users" 
            className={({ isActive }) => clsx(
              "block px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors",
              isActive 
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            onClick={() => setIsSidebarOpen(false)}
          >
            Users
          </NavLink>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md"
            >
                <LogOut size={18} />
                Logout
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10 h-16 flex justify-between items-center px-4 md:px-6">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <Menu size={20} />
                </button>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h2>
            </div>
            
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Admin User'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'admin@example.com'}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indigo-500 overflow-hidden flex items-center justify-center text-white">
                         {user?.image ? (
                             <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                         ) : (
                             <User size={18} />
                         )}
                    </div>
                </div>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
