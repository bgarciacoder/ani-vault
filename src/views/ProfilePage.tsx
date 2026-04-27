import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getAnimeList } from '../lib/userApi';
import type { AnimeListItem } from '../types';
import { useAuth } from '../state/auth/useAuth';
import { UserAnimeCard } from '../features/profile/UserAnimeCard';
import { Button } from '../ui/Button';
import AiringCalendarModal from '../features/calendar/AiringCalendarModal';


interface StatusCounts {
  visto: number;
  enPausa: number;
  cancelado: number;
  pendiente: number;
  siguiendo: number;
}

export default function ProfilePage() {
  const { user, isAuthReady } = useAuth();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AnimeListItem[]>([]);
  const [q, setQ] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    visto: 0,
    enPausa: 0,
    cancelado: 0,
    pendiente: 0,
    siguiendo: 0
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!isAuthReady || !user) return;

    const controller = new AbortController();
    let isMounted = true;

    const fetchAnimeList = async () => {
      try {
        setLoading(true);
        const response = await getAnimeList({ page, status });
        
        if (isMounted && !controller.signal.aborted) {
          setItems(response.data);
          setStatusCounts(response.statusCounts);
        }
      } catch (error) {
        if (isMounted && !controller.signal.aborted) {
          const errorMessage = error instanceof Error ? error.message : "Could not load your list.";
          toast.error(errorMessage);
        }
      } finally {
        if (isMounted && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAnimeList();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page, status, user, isAuthReady]);

  const stats = useMemo(() => {
    const counts: Record<string, number> = { pendiente: statusCounts.pendiente ?? 0, visto: statusCounts.visto ?? 0, 'en pausa': statusCounts.enPausa ?? 0, cancelado: statusCounts.cancelado ?? 0, siguiendo: statusCounts.siguiendo ?? 0 };
    return counts;
  }, [statusCounts]);

  const filteredItems = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((it) => it.title.toLowerCase().includes(needle));
  }, [items, q]);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{user?.email}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <button onClick={ () => setStatus('pendiente') } className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            Pending: {stats['pendiente']}
          </button>
          <button onClick={ () => setStatus('visto') } className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            Watched: {stats['visto']}
          </button>
          <button onClick={ () => setStatus('siguiendo') } className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            Following: {stats['siguiendo']}
          </button>
          <button onClick={ () => setStatus('en pausa') } className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            On Hold: {stats['en pausa']}
          </button>
          <button onClick={ () => setStatus('cancelado') } className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            Droped: {stats['cancelado']}
          </button>
          <button onClick={ () => setStatus('') } className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            Total: {stats['pendiente'] + stats['visto'] + stats['siguiendo'] + stats['en pausa'] + stats['cancelado']}
          </button>
        </div>

        <div className="mt-5">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Search in your list</div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g., Naruto..."
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none ring-slate-900/10 focus:border-slate-900 focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:ring-white/10 dark:focus:border-slate-100"
          />
          {!!q.trim() && (
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Showing <span className="font-semibold text-slate-900 dark:text-slate-50">{filteredItems.length}</span>{' '}
              of <span className="font-semibold text-slate-900 dark:text-slate-50">{items.length}</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Informational calendar of airing episodes.
          </div>
          <Button variant="secondary" onClick={() => setCalendarOpen(true)}>
            Open calendar
          </Button>
        </div>
      </section>

      <section className="flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          Page <span className="font-semibold text-slate-900 dark:text-slate-50">{page}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page === 1 || loading} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button variant="secondary" disabled={loading} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </section>

      <div className='text-2xl font-bold tracking-tight'>
        Animes in your list
      </div>

      <AiringCalendarModal open={calendarOpen} onClose={() => setCalendarOpen(false)} />

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Loading list...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          You don't have any animes in your list yet. Go to Home and click "Add to my list".
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          No results found for “{q.trim()}”.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((it) => (
            <UserAnimeCard
              key={it._id}
              item={it}
              onChanged={(next) => {
                setItems((prev) => {
                  if (!next) return prev.filter((p) => p._id !== it._id);
                  return prev.map((p) => (p._id === it._id ? next : p));
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

