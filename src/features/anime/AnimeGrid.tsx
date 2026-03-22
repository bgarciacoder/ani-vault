import { AnimeCard } from './AnimeCard';

export function AnimeGrid({
  items,
}: {
  items: Array<{ animeId: number; title: string; image: string }>;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((a) => (
        <AnimeCard key={a.animeId} animeId={a.animeId} title={a.title} image={a.image} />
      ))}
    </div>
  );
}

