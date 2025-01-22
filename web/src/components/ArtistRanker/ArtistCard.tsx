import React from 'react';
import { Star, Calendar, Clock, Users, AlertTriangle } from 'lucide-react';
import type { Artist } from '@/types';

interface ArtistCardProps {
  artist: Artist;
  conflicts: Artist[];
  onRatingChange: (rating: number) => void;
  onMustSeeToggle: () => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  conflicts,
  onRatingChange,
  onMustSeeToggle,
}) => {
  return (
    <div 
      className={`rounded-lg bg-neutral-700/30 p-4 transition-colors
        ${artist.mustSee ? 'ring-1 ring-teal-500' : 'hover:bg-neutral-700/50'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{artist.name}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-400">
            <span>{artist.genre}</span>
            <span className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {artist.day}
            </span>
            <span className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {artist.startTime} - {artist.endTime}
            </span>
            <span>{artist.stage}</span>
          </div>
          
          {/* Friend Overlap */}
          {artist.friendOverlap?.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm text-teal-300">
              <Users className="h-4 w-4" />
              {artist.friendOverlap.length} friends rated this highly:
              <span className="text-xs text-teal-200/70">
                {artist.friendOverlap.map(f => f.username).join(', ')}
              </span>
            </div>
          )}
          
          {/* Conflicts */}
          {conflicts.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm text-rose-400">
              <AlertTriangle className="h-4 w-4" />
              Conflicts with: {conflicts.map(c => c.name).join(', ')}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map(rating => (
            <button
              key={rating}
              onClick={() => onRatingChange(rating)}
              className={`transition-colors ${
                artist.rating >= rating ? 'text-teal-400' : 'text-neutral-600'
              }`}
            >
              <Star className="h-6 w-6 fill-current" />
            </button>
          ))}
          
          <button
            onClick={onMustSeeToggle}
            className={`ml-4 rounded-full px-4 py-1 text-sm font-medium transition-colors
              ${artist.mustSee 
                ? 'bg-teal-600 text-white' 
                : 'bg-neutral-600 hover:bg-neutral-500'}`}
          >
            Must See
          </button>
        </div>
      </div>
    </div>
  );
};
