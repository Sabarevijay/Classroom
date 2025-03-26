import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, googleLogout, useGoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
import { Menu, Home, User, Settings, Bell, Search, LogOut, X, Plus, Sun, Moon } from "lucide-react";

// Replace with your actual Google Client ID
const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE"; // Replace with your Google Client ID

const AdaptiveSidebar = () => {
  const [darkTheme, setDarkTheme] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Google Login
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const userInfo = jwtDecode(tokenResponse.credential);
      setUser({
        name: userInfo.name,
        email: userInfo.email,
        imageUrl: userInfo.picture,
      });
    },
    onError: () => {
      console.error('Google Login Failed');
    },
  });

  // Google Logout
  const handleLogout = () => {
    googleLogout();
    setUser(null);
    setShowProfileMenu(false);
  };

  // Toggle Profile Menu
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Custom CSS classes for search bar positioning and styling
  const searchBarClasses = `
    relative max-w-xl flex-1
    transition-all duration-300 ease-in-out
    ${darkTheme ? 'bg-gray-800/40' : 'bg-gray-200/40'}
    rounded-full border ${darkTheme ? 'border-gray-700/30' : 'border-gray-300/30'}
    hover:shadow-md focus-within:shadow-lg
  `;

  // Custom CSS classes for action buttons
  const actionButtonClasses = `
    p-2.5 rounded-full transition-all duration-300
    hover:scale-105 shadow-md
    ${darkTheme 
      ? 'bg-gray-800/40 hover:bg-gray-700/50' 
      : 'bg-gray-200/40 hover:bg-gray-300/50'}
  `;

  const navItems = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
   
      <div className={`${darkTheme ? 'dark' : ''} flex w-full h-screen ${
        darkTheme 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-white'
      }`}>
      
        {/* Unified Sidebar Design */}
        <div
          className={`relative h-screen ${
            darkTheme 
              ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
              : 'bg-gray-200'
          } backdrop-blur-lg transition-all duration-300 ease-out z-20 flex flex-col ${
            isOpen ? 'w-64' : 'w-20'
          }`}
          onMouseEnter={() => !isMobile && setIsOpen(true)}
          onMouseLeave={() => !isMobile && setIsOpen(false)}
        >
          <div className="flex items-center justify-between p-5">
            {isOpen && (
              <div className="flex items-center space-x-2">
                <img src="/logo2.png" alt="Logo" className="h-8 w-auto filter brightness-125" />
                <span className="text-xl font-bold bg-gradient-to-r from-[#009dfc] to-blue-400 bg-clip-text text-transparent">
                  {/* Optional text next to logo */}
                </span>
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-300/20 transition-all duration-200 group"
            >
              <div className="relative w-6 h-6">
                <Menu className={`absolute transition-all ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'} group-hover:scale-110 ${darkTheme ? 'text-gray-300' : 'text-gray-700'}`} />
                <X className={`absolute transition-all ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'} group-hover:scale-110 ${darkTheme ? 'text-gray-300' : 'text-gray-700'}`} />
              </div>
            </button>
          </div>

          {/* Flattened Navigation Items */}
          <nav className={`flex-1 overflow-y-auto py-6 px-3 space-y-2 ${darkTheme ? 'text-gray-200' : 'text-gray-800'}`}>
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveItem(item.key)}
                className={`
                  w-full flex items-center h-12 ${isOpen ? 'px-4' : 'px-2 justify-center'} 
                  ${activeItem === item.key 
                    ? `${darkTheme ? 'border-l-4 border-[#009dfc] text-white' : 'border-l-4 border-[#009dfc] text-gray-900'}`
                    : `${darkTheme ? 'text-gray-400 hover:bg-gray-800/40' : 'text-gray-600 hover:bg-gray-200/40'}`}
                  transition-all duration-300 group
                `}
              >
                <item.icon className={`h-5 w-5 ${activeItem === item.key ? 'text-[#009dfc]' : ''}`} />
                {isOpen && (
                  <span className={`ml-4 font-medium tracking-wide ${activeItem === item.key ? '' : ''}`}>
                    {item.label}
                  </span>
                )}
                {!isOpen && (
                  <div className={`absolute left-full ml-4 px-2 py-1 ${darkTheme ? 'bg-gray-800' : 'bg-gray-200'} rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <span className="text-sm whitespace-nowrap">{item.label}</span>
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Profile Section */}
          {user && (
            <div className="p-4">
              <div className="flex items-center space-x-3 group cursor-pointer" onClick={toggleProfileMenu}>
                <img src={user.imageUrl} alt="Profile" className="h-10 w-10 rounded-lg border-2 border-[#009dfc]/30" />
                {isOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className={`text-xs ${darkTheme ? 'text-gray-400' : 'text-gray-600'} truncate`}>{user.email}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Unified Navbar Design */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <nav className={`
            ${darkTheme 
              ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
              : 'bg-gray-200'
            } 
            backdrop-blur-lg px-8 py-4 flex items-center
          `}>
            {/* Search and Controls */}
            <div className="flex items-center space-x-6 mr-auto">
              <img 
                src="/logo2.png" 
                alt="Logo" 
                className={`h-10 w-auto filter ${
                  darkTheme 
                  ? 'brightness-75 contrast-125' 
                  : 'brightness-125 contrast-100'
                }`} 
              />
            </div>

            {/* Right-side Controls */}
            <div className="flex items-center space-x-5">
              {/* Rounded Search Bar */}
              <div className={searchBarClasses}>
                <div className="absolute inset-y-0 left-4 flex items-center">
                  <Search className={`h-4 w-4 ${darkTheme ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Search courses, documents, alerts..."
                  className={`
                    w-full px-4 py-2.5 pl-12 rounded-full focus:outline-none focus:ring-2 focus:ring-[#009dfc]/80 transition-all
                    ${darkTheme 
                      ? 'bg-gray-800/40 border border-gray-700/30 text-white placeholder-gray-400' 
                      : 'bg-gray-200/40 border border-gray-300/30 text-black placeholder-gray-600'
                    }
                  `}
                />
              </div>

              {/* Rounded Action Buttons */}
              <button className="p-2.5 rounded-full bg-[#009dfc]/80 hover:bg-[#009dfc] transition-colors shadow-lg">
                <Plus className="h-5 w-5 text-white" />
              </button>

              {/* Profile Icon - Added for both logged in and out states */}
              {user ? (
                <div className="relative">
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="h-10 w-10 rounded-full cursor-pointer border-2 border-[#009dfc]/30 hover:border-[#009dfc]/60 transition-all"
                    onClick={toggleProfileMenu}
                  />
                  {showProfileMenu && (
                    <div className={`absolute right-0 mt-2 w-48 ${darkTheme ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-lg z-10`}>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-4 py-2 text-sm ${darkTheme ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} flex items-center space-x-2`}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  className={actionButtonClasses}
                  onClick={() => login()}
                >
                  <User className="h-5 w-5 text-gray-600" />
                </button>
              )}

              <button 
                onClick={() => setDarkTheme(!darkTheme)}
                className={actionButtonClasses}
              >
                {darkTheme ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5 text-[#009dfc]" />
                )}
              </button>
            </div>
          </nav>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
              {/* Placeholder content */}
              <h1 className={`text-3xl font-bold ${darkTheme ? 'text-white' : 'text-gray-900'}`}>
                Welcome to the Dashboard
              </h1>
              <p className={`mt-4 ${darkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                This is a placeholder for your dashboard content.
              </p>
            </div>
          </div>
        </div>
      </div>

  
  );
};

export default AdaptiveSidebar;