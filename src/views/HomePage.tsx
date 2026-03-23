import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchAnimePage } from '../lib/jikan';
import { AnimeGrid } from '../features/anime/AnimeGrid';
import { Button } from '../ui/Button';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [items, setItems] = useState<Array<{ animeId: number; title: string; image: string }>>([]);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 350);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAnimePage(page, debouncedQ)
      .then((r) => {
        if (cancelled) return;
        setHasNext(r.pagination.has_next_page);
        setItems(
          r.data.map((a) => ({
            animeId: a.mal_id,
            title: a.title,
            image: a.images?.jpg?.image_url ?? '',
          }))
        );
      })
      .catch(() => toast.error('No se pudo cargar Jikan. Reintenta.'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [page, debouncedQ]);

  const subtitle = useMemo(() => {
    if (debouncedQ.trim()) return `Resultados para “${debouncedQ.trim()}”`;
    return 'Explora animes y guárdalos en tu lista personal.';
  }, [debouncedQ]);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ANIVAULT</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
          </div>
          <div className="w-full sm:max-w-md">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Buscador</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ej: Naruto, One Piece..."
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none ring-slate-900/10 focus:border-slate-900 focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:ring-white/10 dark:focus:border-slate-100"
            />
          </div>
        </div>
      </section>

      <section className="flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          Página <span className="font-semibold text-slate-900 dark:text-slate-50">{page}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page === 1 || loading} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </Button>
          <Button variant="secondary" disabled={!hasNext || loading} onClick={() => setPage((p) => p + 1)}>
            Siguiente
          </Button>
        </div>
      </section>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Cargando...
        </div>
      ) : (
        <AnimeGrid items={items.filter((x) => x.image)} />
      )}
    </div>
  );
}

