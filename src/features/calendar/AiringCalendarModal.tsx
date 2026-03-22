import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import type { AnimeListItem } from '../../types';
import { fetchAnimeDetails } from '../../lib/jikan';
import { Button } from '../../ui/Button';

type AiringSchedule = {
  animeId: number;
  title: string;
  weekday: number; // 0=Sun ... 6=Sat
  time?: string | null;
  timezone?: string | null;
};

function dayToWeekday(day?: string | null): number | null {
  const d = (day ?? '').trim().toLowerCase();
  if (!d) return null;
  if (d.startsWith('sunday')) return 0;
  if (d.startsWith('monday')) return 1;
  if (d.startsWith('tuesday')) return 2;
  if (d.startsWith('wednesday')) return 3;
  if (d.startsWith('thursday')) return 4;
  if (d.startsWith('friday')) return 5;
  if (d.startsWith('saturday')) return 6;
  return null;
}

function monthLabel(d: Date) {
  return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

function buildMonthGrid(month: Date) {
  const year = month.getFullYear();
  const m = month.getMonth();
  const first = new Date(year, m, 1);
  const startOffset = first.getDay(); // 0=Sun
  const start = new Date(year, m, 1 - startOffset);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  return { days, monthIndex: m };
}

export default function AiringCalendarModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());
  const [schedules, setSchedules] = useState<AiringSchedule[]>([]);



  useEffect(() => {
    if (!open) return;


    document.body.style.overflow = 'hidden';

    let cancelled = false;
    setLoading(true);
    let results = [];
  
    const run = async () => {
      try {
        const days = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday"
        ];
  
        const day = days[selected.getDay()];
  
        const r = await fetchAnimeDetails(day);
        const items = r.data;
        // for (const day of weekDays) {
          
        for (const anime of items) {
          if (!anime.airing) continue;

          let weekday = null;

          if (anime.broadcast?.day) {
            weekday = dayToWeekday(anime.broadcast.day);
          } else if (anime.broadcast?.string) {
            const match = anime.broadcast.string.match(
              /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i
            );
            if (match) {
              weekday = dayToWeekday(match[1]);
            }
          }

          if (weekday == null) continue;

          results.push({
            animeId: anime.mal_id,
            title: anime.title,
            weekday,
            dateFrom: anime.aired?.from ?? "",
            dateTo: anime.aired?.to ?? "",
            time: anime.broadcast?.time ?? null,
            timezone: anime.broadcast?.timezone ?? null,
          });
        }
  
      } catch (e: any) {
        if (e?.response?.status === 429) {
          toast.error('Jikan está limitando peticiones (429). Espera y reintenta.');
        }
      } finally {
        if (!cancelled) {
          setSchedules(results);
          setLoading(false);
        }
      }
    };
  
    run();
  
    return () => {
      cancelled = true;
      document.body.style.overflow = '';
    };
  }, [open, selected]);


  const { days, monthIndex } = useMemo(() => buildMonthGrid(month), [month]);

  const byWeekday = useMemo(() => {
    const map = new Map<number, AiringSchedule[]>();
    for (const s of schedules) {
      map.set(s.weekday, [...(map.get(s.weekday) ?? []), s]);
    }
    for (const [, arr] of map) arr.sort((a, b) => a.title.localeCompare(b.title));
    return map;
  }, [schedules]);

  const selectedList = useMemo(() => {
    return byWeekday.get(selected.getDay()) ?? [];
  }, [byWeekday, selected]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 margin-top-0">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="overflow-auto scrollbar-hide-desktop absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl rounded-t-3xl border border-slate-800 bg-slate-950 p-4 shadow-2xl sm:inset-0 sm:my-auto sm:rounded-3xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Calendario de emisión</h2>
            <p className="mt-1 text-sm text-slate-300">
              Marca días con animes en emisión. Solo informativo.
            </p>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2">
          <Button
            variant="secondary"
            onClick={() => setMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          >
            Mes anterior
          </Button>
          <div className="text-sm font-semibold capitalize text-slate-100">{monthLabel(month)}</div>
          <Button
            variant="secondary"
            onClick={() => setMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          >
            Mes siguiente
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-300">
          {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-2">
          {days.map((d) => {
            const inMonth = d.getMonth() === monthIndex;
            const isSelected =
              d.getFullYear() === selected.getFullYear() &&
              d.getMonth() === selected.getMonth() &&
              d.getDate() === selected.getDate();

            const hasAiring = (byWeekday.get(d.getDay())?.length ?? 0) > 0;

            const count = byWeekday.get(d.getDay())?.length ?? 0;

            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelected(d)}
                className={[
                  'relative flex aspect-square items-center justify-center rounded-2xl border text-sm font-semibold transition',
                  inMonth ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-slate-900 bg-slate-950 text-slate-600',
                  isSelected ? 'ring-2 ring-slate-100' : 'hover:bg-slate-800',
                ].join(' ')}
              >
                {d.getDate()}
                {hasAiring && (
                  <span className="absolute right-2 top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-sm font-semibold text-slate-100">
            {selected.toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long' })}
          </div>

          {loading ? (
            <div className="mt-2 text-sm text-slate-300">Cargando emisiones...</div>
          ) : selectedList.length === 0 ? (
            <div className="mt-2 text-sm text-slate-300">No hay animes en emisión para este día.</div>
          ) : (
            <ul className="mt-2 space-y-2">
              {selectedList.map((s) => (
                <li key={s.animeId} className="flex items-start justify-between gap-3 rounded-xl bg-slate-950 px-3 py-2">
                  <div className="text-sm font-semibold text-slate-100">{s.title}</div>
                  <div className="shrink-0 text-xs text-slate-300">
                    {s.time ? s.time : '--:--'} {s.timezone ? `(${s.timezone})` : ''}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-3 text-xs text-slate-400">
          Nota: Puede no tener horario para todos los animes.
        </div>
      </div>
    </div>
  );
}

