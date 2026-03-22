import React, { useState } from 'react';
import Image from './AppImage';
import Icon from './AppIcons';
import { Button } from './Button';
import type { AnimeListItem, AnimeStatus } from '../types';
import toast from 'react-hot-toast';
import { updateAnimeStatus, updateAnimeChapterPaused } from '../lib/userApi';
import { Field } from './Field';

export default function QuickViewModal({ 
    item, 
    isOpen, 
    onClose,
    onChanged
}: 
{
    item: any;
    isOpen: boolean;
    onClose: () => void;
    onChanged: (next?: AnimeListItem) => void
}){
    if (!isOpen || !item) return null;

    const [state, setState] = useState<string>();
    const [chapterPaused, setChapterPaused] = useState("");
//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('es-ES', {
//       style: 'currency',
//       currency: 'EUR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     })?.format(price);
//   };

//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;

//     for (let i = 0; i < fullStars; i++) {
//       stars?.push(
//         <Icon key={i} name="Star" size={16} className="text-amber-400 fill-current" />
//       );
//     }

//     if (hasHalfStar) {
//       stars?.push(
//         <Icon key="half" name="Star" size={16} className="text-amber-400 fill-current opacity-50" />
//       );
//     }

//     const emptyStars = 5 - Math.ceil(rating);
//     for (let i = 0; i < emptyStars; i++) {
//       stars?.push(
//         <Icon key={`empty-${i}`} name="Star" size={16} className="text-gray-300" />
//       );
//     }

//     return stars;
//   };

//   const getBoatTypeLabel = (type) => {
//     const typeLabels = {
//       yacht: 'Yate',
//       sailboat: 'Velero',
//       motorboat: 'Lancha motora',
//       catamaran: 'Catamarán',
//       fishing: 'Barco de pesca',
//       speedboat: 'Lancha rápida'
//     };
//     return typeLabels?.[type] || type;
//   };

    async function setStatus(status: AnimeStatus) {
        try {
            setState(status);
            const updated = await updateAnimeStatus(item._id, status);
            toast.success('Estado actualizado');
            onChanged(updated);
        } catch (e: any) {
            toast.error(e?.response?.data?.message ?? 'No se pudo actualizar.');
        }
    }


    async function setChatpter() {
        try{
            console.log("Cap")
            const updated = await updateAnimeChapterPaused(item._id, chapterPaused);
            toast.success('Capítulo donde lo dejaste actualizado.')
        } catch (e: any) {
            toast.error(e?.response?.data?.message ?? 'No se pudo actualizar.');
        }
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
        <div className="relative bg-card border border-border rounded-lg maritime-shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-slate-950absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl rounded-t-3xl border border-slate-800 bg-slate-950 p-4 shadow-2xl sm:inset-0 sm:my-auto sm:rounded-3xl sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Editado rápido</h2>
            <Button variant="secondary" onClick={onClose}>
                <Icon name="X" size={20} />
            </Button>
            </div>

            {/* Content */}
            <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="space-y-4">
                <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                    src={item?.image ?? undefined}
                    alt={item?.title ?? undefined}
                    className="w-full h-full object-cover"
                    />
                </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{item?.title}</h3>
                    </div>
                    {/* Buttons */}
                    <div className='grid grid-cols-2 gap-4 p-4 border-b border-border'>
                        <Button variant="secondary" onClick={() => setStatus('pendiente')}>
                            Pendiente
                        </Button>
                        <Button variant="secondary" onClick={() => setStatus('visto')}>
                            Visto
                        </Button>
                        <Button variant="secondary" onClick={() => setStatus('en pausa')}>
                            En pausa
                        </Button>
                        <Button variant="secondary" onClick={() => setStatus('cancelado')}>
                            Cancelado
                        </Button>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">Introduce el capítulo del anime donde lo has pausado</div>
                        <input type="text" value={chapterPaused} onChange={(e) => setChapterPaused(e.target.value)} className='w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none ring-slate-900/10 focus:border-slate-900 focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10 dark:focus:border-slate-100' />
                        <Button variant='secondary' onClick={() => setChatpter}>
                            Añadir capítulo
                        </Button>
                    </div>
                </div>
                {/* Price and Actions */}
                <div className="pt-4 border-t border-border">
                    <div className="space-y-2">
                        <Button variant='secondary' onClick={onClose}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
  );
};