import React, { useState } from 'react';
import { Search, LogOut } from 'lucide-react';
import { Artist } from '@/types';
import { useArtists } from '@/hooks/useArtists';
import { ArtistCard } from './ArtistCard';
import { ScheduleView } from './ScheduleView';
import { auth } from '@/services/api';

interface Props {
  onLogout: () => void;
}

export const ArtistRanker: React.FC<Props> = ({ onLogout }) => {
  const [view, setView] = useState<'list' | 'schedule'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedDay, setSelectedDay] = useState('All');
  
  const { artists, loading, error, handleRating, toggleMustSee } = useArtists();

  // Check for schedule conflicts
  const hasConflict = (artist1: Artist, artist2: Artist) => {
    if (artist1.day !== artist2.day) return false;
    const start1 = new Date(`2025-01-01 ${artist1.startTime}`);
    const end1 = new Date(`2025-01-01 ${artist1.endTime}`);
    const start2 = new Date(`2025-01-01 ${artist2.startTime}`);
    const end2 = new Date(`2025-01-01 ${artist2.endTime}`);
    return start1 < end2 && end1 > start2;
  };

  // Get all conflicts for a must-see artist
  const getConflicts = (artist: Artist) => {
    if (!artist.mustSee) return [];
    return artists.filter(other => 
      other._id !== artist._id && 
      other.mustSee && 
      hasConflict(artist, other)
    );
  };

  const handleLogoutClick = () => {
    auth.logout();
    onLogout();
  };

  const filteredArtists = artists.filter(artist => 
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedGenre === 'All' || artist.genre === selectedGenre) &&
    (selectedDay === 'All' || artist.day === selectedDay)
  );

  return (
    <div className="min-h-screen bg-neutral-900 p-4 text-neutral-200">
      <div className="mx-auto max-w-6xl rounded-lg bg-neutral-800/50 p-6 backdrop-blur-sm">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-teal-300">Festival Planner</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <button 
                onClick={() => setView('list')}
                className={`rounded-lg px-4 py-2 ${
                  view === 'list' ? 'bg-teal-600 text-white' : 'bg-neutral-700 hover:bg-neutral-600'
                }`}
              >
                List View
              </button>
              <button 
                onClick={() => setView('schedule')}
                className={`rounded-lg px-4 py-2 ${
                  view === 'schedule' ? 'bg-teal-600 text-white' : 'bg-neutral-700 hover:bg-neutral-600'
                }`}
              >
                Schedule View
              </button>
            </div>
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 rounded-lg bg-neutral-700 px-4 py-2 text-neutral-200 hover:bg-neutral-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex flex-1 items-center rounded-lg bg-neutral-700/50 px-4 py-2">
            <Search className="mr-2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search artists..."
              className="w-full bg-transparent placeholder-neutral-400 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="rounded-lg bg-neutral-700/50 px-4 py-2"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {['All', 'Electronic', 'Hip Hop', 'Pop', 'Rock', 'Alternative', 'R&B', 'Latin', 'K-pop'].map(genre => (
              <option key={genre} value={genre} className="bg-neutral-800">
                {genre}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg bg-neutral-700/50 px-4 py-2"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {['All', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <option key={day} value={day} className="bg-neutral-800">
                {day}
              </option>
            ))}
          </select>
        </div>

        {view === 'list' ? (
          <div className="space-y-2">
            {filteredArtists.map(artist => (
              <ArtistCard
                key={artist._id}
                artist={artist}
                conflicts={getConflicts(artist)}
                onRatingChange={(rating) => handleRating(artist._id, rating)}
                onMustSeeToggle={() => toggleMustSee(artist._id)}
              />
            ))}
          </div>
        ) : (
          <ScheduleView
            artists={filteredArtists}
            selectedDay={selectedDay === 'All' ? 'Friday' : selectedDay}
            getConflicts={getConflicts}
          />
        )}
      </div>
    </div>
  );
};
