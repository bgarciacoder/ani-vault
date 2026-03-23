import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getAnimeList } from '../lib/userApi';
import type { AnimeListItem } from '../types';
import { useAuth } from '../state/auth/useAuth';
import { UserAnimeCard } from '../features/profile/UserAnimeCard';
import { Button } from '../ui/Button';
import AiringCalendarModal from '../features/calendar/AiringCalendarModal';

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AnimeListItem[]>([]);
  const [q, setQ] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const timeoutId = setTimeout(() => {
      getAnimeList()
        .then((r) => {
          if (!cancelled) setItems(r);
        })
        .catch(() => {
          if (!cancelled) toast.error("No se pudo cargar tu lista.");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 500);
  
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  const stats = useMemo(() => {
    const counts: Record<string, number> = { pendiente: 0, visto: 0, 'en pausa': 0, cancelado: 0 };
    for (const it of items) counts[it.status] = (counts[it.status] ?? 0) + 1;
    return counts;
  }, [items]);

  const filteredItems = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((it) => it.title.toLowerCase().includes(needle));
  }, [items, q]);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{user?.email}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            Pendiente: {stats['pendiente']}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            Visto: {stats['visto']}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            En pausa: {stats['en pausa']}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            Cancelado: {stats['cancelado']}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            Total: {stats['pendiente'] + stats['visto'] + stats['en pausa'] + stats['cancelado']}
          </span>
        </div>

        <div className="mt-5">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Buscar en mi lista</div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ej: Naruto..."
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none ring-slate-900/10 focus:border-slate-900 focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:ring-white/10 dark:focus:border-slate-100"
          />
          {!!q.trim() && (
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Mostrando <span className="font-semibold text-slate-900 dark:text-slate-50">{filteredItems.length}</span>{' '}
              de <span className="font-semibold text-slate-900 dark:text-slate-50">{items.length}</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Calendario informativo de episodios en emisión.
          </div>
          <Button variant="secondary" onClick={() => setCalendarOpen(true)}>
            Abrir calendario
          </Button>
        </div>
      </section>

      <div className='text-2xl font-bold tracking-tight'>
        Animes de tu lista
      </div>

      <AiringCalendarModal open={calendarOpen} onClose={() => setCalendarOpen(false)} />

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Cargando lista...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Aún no tienes animes en tu lista. Ve a Home y pulsa “Añadir a mi lista”.
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          No hay resultados para “{q.trim()}”.
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

