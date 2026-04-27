import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchAnimeById, type JikanAnimeFullDetails } from '../lib/jikan';
import { Button } from '../ui/Button';
import { useAuth } from '../state/auth/useAuth';
import { addAnimeToList } from '../lib/userApi';

export default function AnimePage() {
  const { animeId } = useParams<{ animeId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [anime, setAnime] = useState<JikanAnimeFullDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!animeId) {
      navigate('/');
      return;
    }

    let cancelled = false;
    setLoading(true);
    
    fetchAnimeById(Number(animeId))
      .then((data) => {
        if (cancelled) return;
        setAnime(data);
      })
      .catch(() => {
        if (!cancelled) {
          toast.error('No se pudo cargar el anime. Reintenta.');
          navigate('/');
        }
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [animeId, navigate]);

  async function handleAddToList() {
    if (!token) {
      toast.error('Inicia sesión para añadir a tu lista.');
      return;
    }

    if (!anime) return;

    setAdding(true);
    try {
      const image = anime.images?.jpg?.image_url ?? anime.images?.webp?.image_url ?? '';
      await addAnimeToList({
        animeId: anime.mal_id,
        title: anime.title,
        image,
      });
      toast.success('Añadido a tu lista');
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'No se pudo añadir.';
      toast.error(msg);
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-slate-600 dark:text-slate-300">Loading...</div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-slate-600 dark:text-slate-300">Anime not found</div>
      </div>
    );
  }

  const imageUrl = anime.images?.jpg?.large_image_url ?? anime.images?.jpg?.image_url ?? anime.images?.webp?.image_url ?? '';
  const genres = anime.genres?.map((g) => g.name).join(', ') || 'N/A';
  const studios = anime.studios?.map((s) => s.name).join(', ') || 'N/A';
  const themes = anime.themes?.map((t) => t.name).slice(0, 3).join(', ') || 'N/A';

  return (
    <div className="space-y-6">
      {/* Header con botón atrás */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        ← Back
      </button>

      {/* Main content */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Sidebar - Imagen y acciones */}
        <div className="md:col-span-1">
          <div className="sticky top-20 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <img
                src={imageUrl}
                alt={anime.title}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>

            <Button
              onClick={handleAddToList}
              disabled={adding}
              className="w-full"
            >
              {adding ? 'Adding...' : 'Add to My List'}
            </Button>

            {/* Quick stats */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {anime.score ? anime.score.toFixed(1) : 'N/A'}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Rating</div>
                {anime.scored_by && (
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                    ({anime.scored_by.toLocaleString()} votes)
                  </div>
                )}
              </div>

              <hr className="border-slate-200 dark:border-slate-700" />

              <div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Rank</div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {anime.rank ? `#${anime.rank}` : 'N/A'}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Popularity</div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {anime.popularity ? `#${anime.popularity}` : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content - Info del anime */}
        <div className="md:col-span-2 lg:col-span-3 space-y-6">
          {/* Título y estado */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {anime.title}
            </h1>

            {anime.title_english && anime.title_english !== anime.title && (
              <p className="mt-1 text-lg text-slate-600 dark:text-slate-400">{anime.title_english}</p>
            )}

            {anime.title_japanese && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">{anime.title_japanese}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {anime.status && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {anime.status}
                </span>
              )}
              {anime.type && (
                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  {anime.type}
                </span>
              )}
              {anime.airing ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  On airing
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Finished
                </span>
              )}
            </div>
          </div>

          {/* Información básica */}
          <div className="grid gap-4 sm:grid-cols-2">
            {anime.episodes !== null && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Episodes</div>
                <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {anime.episodes}
                </div>
              </div>
            )}

            {anime.duration && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Duration</div>
                <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {anime.duration}
                </div>
              </div>
            )}

            {anime.aired?.string && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Airing</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {anime.aired.string}
                </div>
              </div>
            )}

            {anime.source && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Source</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {anime.source}
                </div>
              </div>
            )}

            {anime.rating && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Rating</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {anime.rating}
                </div>
              </div>
            )}

            {anime.broadcast?.string && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Broadcast</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {anime.broadcast.string}
                </div>
              </div>
            )}
          </div>

          {/* Géneros, Estudios, Temas */}
          <div className="space-y-3">
            {anime.genres && anime.genres.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">Genres</div>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {anime.studios && anime.studios.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">Studios</div>
                <div className="flex flex-wrap gap-2">
                  {anime.studios.map((studio) => (
                    <span
                      key={studio.mal_id}
                      className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                    >
                      {studio.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {anime.themes && anime.themes.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">Themes</div>
                <div className="flex flex-wrap gap-2">
                  {anime.themes.slice(0, 5).map((theme) => (
                    <span
                      key={theme.mal_id}
                      className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
                    >
                      {theme.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sinopsis */}
          {anime.synopsis && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">Synopsis</h2>
              <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                {anime.synopsis}
              </p>
            </div>
          )}

          {/* Background */}
          {anime.background && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">Additional Information</h2>
              <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                {anime.background}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
