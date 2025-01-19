import { useEffect, useState } from 'react';
import { ArtistCard } from './ArtistCard';
import * as api from '../../api/client';
import type { Artist } from '../../types/artist';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export function ArtistGrid() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, login } = useAuth();

  const loadArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.fetchArtists();
      setArtists(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load artists'));
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceSelected = async (artistId: string, interest: string) => {
    try {
      setError(null);
      const updatedUser = await api.setArtistPreference(artistId, interest);
      // Update the user context with new preferences
      login(updatedUser, localStorage.getItem('token') || '');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update preference'));
    }
  };

  useEffect(() => {
    loadArtists();
  }, []);

    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-orange-100">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h3 className="text-xl font-bold text-red-600 mb-2">Error</h3>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 pt-20 pb-16">
      <div className="container px-4 mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 inline-block text-transparent bg-clip-text mb-4">
            Coachella 2024
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and track your favorite artists performing at this year's festival
          </p>
        </header>

        {/* Masonry-style grid with different card sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
          {artists.map((artist, index) => (
            <div 
              key={artist.id} 
              className={`
                ${index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''} 
                ${index % 7 === 0 ? 'lg:col-span-2' : ''}
                transform hover:scale-[1.02] transition-transform duration-300
              `}
            >
              <ArtistCard
                artist={artist}
                selectedInterest={user?.artistPreferences[artist.id] || null}
                onPreferenceSelected={(interest) => 
                  handlePreferenceSelected(artist.id, interest)
                }
                featured={index % 5 === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
