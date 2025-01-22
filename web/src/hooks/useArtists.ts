import { useState, useEffect } from 'react';
import { Artist } from '@/types';
import { artists as artistsApi } from '@/services/api';

export const useArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const data = await artistsApi.getAll();
      setArtists(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch artists'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleRating = async (artistId: string, rating: number) => {
    try {
      const artist = artists.find(a => a.id === artistId);
      if (!artist) return;

      await artistsApi.updateRating(artistId, rating, artist.mustSee);
      setArtists(prevArtists =>
        prevArtists.map(a =>
          a.id === artistId ? { ...a, rating } : a
        )
      );
    } catch (err) {
      console.error('Error updating rating:', err);
    }
  };

  const toggleMustSee = async (artistId: string) => {
    try {
      const artist = artists.find(a => a.id === artistId);
      if (!artist) return;

      await artistsApi.updateRating(artistId, artist.rating, !artist.mustSee);
      setArtists(prevArtists =>
        prevArtists.map(a =>
          a.id === artistId ? { ...a, mustSee: !a.mustSee } : a
        )
      );
    } catch (err) {
      console.error('Error toggling must-see:', err);
    }
  };

  return { 
    artists, 
    loading, 
    error, 
    handleRating, 
    toggleMustSee,
    refreshArtists: fetchArtists
  };
};
