import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const register = async (username: string, password: string) => {
  const response = await api.post('/auth/register', { username, password });
  return response.data;
};

export const fetchArtists = async () => {
  const response = await api.get('/artists');
  return response.data;
};

export const setArtistPreference = async (artistId: string, interestLevel: string) => {
  const response = await api.post(`/artists/${artistId}/preference`, {
    interestLevel
  });
  return response.data;
};