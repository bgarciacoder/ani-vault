import toast from 'react-hot-toast';
import type { AnimeListItem, AnimeStatus } from '../../types';
import { Button } from '../../ui/Button';
import { Field } from '../../ui/Field';
import { deleteAnimeFromList } from '../../lib/userApi';
import { useState } from 'react';
import QuickViewModal from '../../ui/QuickViewModal';

const statusBadge: Record<AnimeStatus, string> = {
  pendiente: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100',
  visto: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  'en pausa': 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  cancelado: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200',
};

export function UserAnimeCard({
  item,
  onChanged,
}: {
  item: AnimeListItem;
  onChanged: (next?: AnimeListItem) => void;
}) {
  const [episode, setEpisode] = useState("");
  const [quickViewAnime, setQuickViewAnime] = useState(null);

 

  async function remove() {
    try {
      await deleteAnimeFromList(item._id);
      toast('Eliminado');
      onChanged(undefined);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'No se pudo eliminar.');
    }
  }

  const handleQuickView = (item: any) => {
    setQuickViewAnime(item);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="p-4">
        <div className="line-clamp-2 min-h-10 text-sm font-semibold">{item.title}</div>
        <div className="mt-2">
          <span className={['inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize', statusBadge[item.status]].join(' ')}>
            {item.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <Button variant="secondary" onClick={() => handleQuickView(item)}>
            Editar estado
          </Button>
          <Button variant="danger" onClick={remove}>
            Eliminar
          </Button>
        </div>
      </div>
      <QuickViewModal item={item} isOpen={!!quickViewAnime} onClose={() => setQuickViewAnime(null)} onChanged={onChanged} />
    </div>
  );
}

