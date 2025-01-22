import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, X, Save, Shield, UserPlus } from 'lucide-react';

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  friends: Array<{ _id: string; username: string }>;
  createdAt: string;
}

interface EditingUser {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  isAdmin: boolean;
}

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Get current admin's ID from localStorage
  const currentAdminId = JSON.parse(localStorage.getItem('user') || '{}')._id;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5003/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setIsCreating(true);
    setEditingUser({
      username: '',
      email: '',
      password: '',
      isAdmin: false
    });
  };

  const handleEdit = (user: User) => {
    setIsCreating(false);
    setEditingUser({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    });
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      if (isCreating) {
        const response = await fetch('http://localhost:5003/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(editingUser)
        });

        if (!response.ok) throw new Error('Failed to create user');
      } else {
        const response = await fetch(`http://localhost:5003/api/admin/users/${editingUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(editingUser)
        });

        if (!response.ok) throw new Error('Failed to update user');
      }
      
      await fetchUsers();
      setEditingUser(null);
      setIsCreating(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user');
    }
  };

  const handleDelete = async (id: string) => {
    // Prevent self-deletion
    if (id === currentAdminId) {
      alert("You cannot delete your own account!");
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`http://localhost:5003/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete user');
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900">
        <div className="text-xl text-white">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700"
          >
            <UserPlus className="h-4 w-4" />
            Create User
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg bg-neutral-800">
          <table className="w-full text-left text-sm text-neutral-200">
            <thead className="bg-neutral-700 text-xs uppercase">
              <tr>
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Admin</th>
                <th className="p-4">Friends</th>
                <th className="p-4">Created</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-t border-neutral-700">
                  <td className="p-4">{user.username}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    {user.isAdmin ? (
                      <Shield className="h-4 w-4 text-teal-400" />
                    ) : null}
                  </td>
                  <td className="p-4">{user.friends.length}</td>
                  <td className="p-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="rounded p-1 hover:bg-neutral-700"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="rounded p-1 hover:bg-neutral-700"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-neutral-800 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {isCreating ? 'Create User' : 'Edit User'}
                </h2>
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setIsCreating(false);
                  }}
                  className="rounded p-1 hover:bg-neutral-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-200">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser(prev => ({ ...prev!, username: e.target.value }))}
                    className="mt-1 block w-full rounded-md bg-neutral-700 p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-200">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser(prev => ({ ...prev!, email: e.target.value }))}
                    className="mt-1 block w-full rounded-md bg-neutral-700 p-2"
                  />
                </div>

                {isCreating && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-200">
                      Password
                    </label>
                    <input
                      type="password"
                      value={editingUser.password || ''}
                      onChange={(e) => setEditingUser(prev => ({ ...prev!, password: e.target.value }))}
                      className="mt-1 block w-full rounded-md bg-neutral-700 p-2"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={editingUser.isAdmin}
                    onChange={(e) => setEditingUser(prev => ({ ...prev!, isAdmin: e.target.checked }))}
                    className="rounded border-neutral-600"
                  />
                  <label htmlFor="isAdmin" className="text-sm font-medium text-neutral-200">
                    Admin Access
                  </label>
                </div>

                <button
                  onClick={handleSave}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700"
                >
                  <Save className="h-4 w-4" />
                  {isCreating ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};