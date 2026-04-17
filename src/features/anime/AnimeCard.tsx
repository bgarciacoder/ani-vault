import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { useAuth } from '../../state/auth/useAuth';
import { addAnimeToList } from '../../lib/userApi';

export function AnimeCard({
  animeId,
  title,
  image,
  onAdded,
}: {
  animeId: number;
  title: string;
  image: string;
  onAdded?: () => void;
}) {
  const { token } = useAuth();
  const navigate = useNavigate();

  async function handleAdd() {
    if (!token) {
      toast.error('Inicia sesión para añadir a tu lista.');
      return;
    }
    try {
      await addAnimeToList({ animeId, title, image });
      toast.success('Añadido a tu lista');
      onAdded?.();
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'No se pudo añadir.';
      toast.error(msg);
    }
  }

  function handleCardClick() {
    navigate(`/anime/${animeId}`);
  }

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-4">
        <div className="line-clamp-2 min-h-10 text-sm font-semibold">{title}</div>
        <div className="mt-3">
          <Button onClick={handleAdd} variant="secondary">
            Añadir a mi lista
          </Button>
        </div>
      </div>
    </div>
  );
}

