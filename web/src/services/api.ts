import axios from 'axios';

const BASE_URL = 'http://localhost:5003/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

// Artists API
export const artists = {
  getAll: async () => {
    const response = await api.get('/artists');
    return response.data;
  },

  updateRating: async (artistId: string, rating: number, mustSee: boolean) => {
    const response = await api.post(`/artists/${artistId}/rate`, { rating, mustSee });
    return response.data;
  },

  getFriendRatings: async (artistId: string) => {
    const response = await api.get(`/artists/${artistId}/friend-ratings`);
    return response.data;
  }
};

// Friends API
export const friends = {
  getAll: async () => {
    const response = await api.get('/friends');
    return response.data;
  },

  addFriend: async (friendId: string) => {
    const response = await api.post('/friends/add', { friendId });
    return response.data;
  }
};
