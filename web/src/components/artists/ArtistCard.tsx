interface ArtistCardProps {
  artist: Artist;
  selectedInterest: string | null;
  onPreferenceSelected: (interest: string) => void;
  featured?: boolean;
}

export function ArtistCard({
  artist,
  selectedInterest,
  onPreferenceSelected,
  featured = false,
}: ArtistCardProps) {
  const interestLevels = ['Would See', 'Want to See', 'Must See'];

  return (
    <div className={`
      relative group overflow-hidden rounded-xl bg-white shadow-lg
      ${featured ? 'aspect-square md:aspect-[4/3]' : 'aspect-[3/4]'}
    `}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={artist.imageURL || `https://source.unsplash.com/800x800/?concert,artist&${artist.name}`}
          alt={artist.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-end">
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-sm">
            {artist.stage}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{artist.name}</h3>
            <p className="text-gray-300">{artist.genre}</p>
          </div>

          <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {interestLevels.map((level) => (
              <button
                key={level}
                onClick={() => onPreferenceSelected(level)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedInterest === level 
                    ? 'bg-white text-purple-600' 
                    : 'bg-white/20 text-white hover:bg-white/30'}
                `}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
