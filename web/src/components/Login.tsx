import React, { useState } from 'react';
import { auth } from '../services/api';

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await auth.login(email, password);
      console.log('Login response:', response); // Debug log
      
      if (response.user) {
        onLogin(response.user);
      } else {
        console.error('No user data in response');
        setError('Invalid login response');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid login credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="max-w-md w-full p-6 bg-neutral-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Login to Festival Planner</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-200">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full bg-neutral-700 border-neutral-600 rounded-md 
                       shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500/20"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-200">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-neutral-700 border-neutral-600 rounded-md 
                       shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500/20"
            />
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                     shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};
