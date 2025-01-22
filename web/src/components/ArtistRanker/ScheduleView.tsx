import React from 'react';
import type { Artist } from '@/types';

interface ScheduleViewProps {
  artists: Artist[];
  selectedDay: string;
  getConflicts: (artist: Artist) => Artist[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  artists,
  selectedDay,
  getConflicts,
}) => {
  const timeSlots = Array.from({ length: 24 }, (_, i) => 
    `${String(i).padStart(2, '0')}:00`
  );

  const stages = ['Main Stage', 'Sahara', 'Mojave', 'Gobi'];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] space-y-4">
        <div className="rounded-lg bg-neutral-700/30 p-4">
          <h2 className="mb-4 text-xl font-bold text-teal-300">{selectedDay}</h2>
          <div className="relative">
            {/* Time slots */}
            <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-sm text-neutral-400">
              {timeSlots.map(time => (
                <div key={time} className="h-12">{time}</div>
              ))}
            </div>
            
            {/* Schedule grid */}
            <div className="ml-16 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              {stages.map(stage => (
                <div key={stage} className="space-y-2">
                  <h3 className="text-center font-medium text-neutral-300">{stage}</h3>
                  <div className="relative h-[576px]">
                    {artists
                      .filter(a => a.day === selectedDay && a.stage === stage)
                      .map(artist => {
                        const startMinutes = parseInt(artist.startTime.split(':')[0]) * 60 + 
                                           parseInt(artist.startTime.split(':')[1]);
                        const endMinutes = parseInt(artist.endTime.split(':')[0]) * 60 + 
                                         parseInt(artist.endTime.split(':')[1]);
                        const duration = endMinutes - startMinutes;
                        const conflicts = getConflicts(artist);
                        
                        return (
                          <div
                            key={artist.id}
                            className={`absolute left-0 right-0 rounded p-2 text-sm
                              ${artist.mustSee 
                                ? 'bg-teal-600/70' 
                                : 'bg-neutral-600/50'} 
                              ${conflicts.length > 0 ? 'ring-2 ring-rose-500' : ''}`}
                            style={{
                              top: `${(startMinutes / 60) * 24}px`,
                              height: `${(duration / 60) * 24}px`
                            }}
                          >
                            <div className="font-medium">{artist.name}</div>
                            <div className="text-xs opacity-75">
                              {artist.startTime} - {artist.endTime}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
