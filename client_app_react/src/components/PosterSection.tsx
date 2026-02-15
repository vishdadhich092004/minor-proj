import type { Poster } from '../types';

interface PosterSectionProps {
  posters: Poster[];
}

const PosterSection = ({ posters }: PosterSectionProps) => {
  if (!posters || posters.length === 0) return null;

  return (
    <div className="w-full overflow-hidden rounded-2xl aspect-[2/1] md:aspect-[3/1] relative">
      <div className="flex snap-x snap-mandatory overflow-x-auto w-full h-full no-scrollbar">
        {posters.map((poster) => (
          <div key={poster._id} className="snap-center min-w-full h-full bg-gray-200">
             <img src={poster.imageUrl} alt={poster.posterName} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PosterSection;
