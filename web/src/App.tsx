import React, { useState, useEffect } from 'react';
import { ArtistRanker } from '@/components/ArtistRanker';
import { AdminPanel } from '@/components/Admin';
import { Login } from '@/components/Login';

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminView, setShowAdminView] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData: User) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // View toggle component
  const ViewToggle = () => (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setShowAdminView(!showAdminView)}
        className="rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-neutral-700"
      >
        Switch to {showAdminView ? 'Festival View' : 'Admin View'}
      </button>
    </div>
  );

  // Only show admin content if user is admin and has selected admin view
  if (currentUser?.isAdmin) {
    return (
      <>
        {showAdminView ? (
          <AdminPanel />
        ) : (
          <ArtistRanker onLogout={handleLogout} />
        )}
        <ViewToggle />
      </>
    );
  }

  return <ArtistRanker onLogout={handleLogout} />;
}

export default App;
