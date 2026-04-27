import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from './AppImage';
import Icon from './AppIcons';
import { Button } from './Button';
import type { AnimeListItem, AnimeStatus } from '../types';
import toast from 'react-hot-toast';
import { updateAnime } from '../lib/userApi';
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


    const [currentStatus, setCurrentStatus] = useState<string>("");
    const [chapterPaused, setChapterPaused] = useState("");


    useEffect(() => {
        if (item.chapterPaused) {
            setChapterPaused(item.chapterPaused ?? "");
        }
        if(item.status){
            setCurrentStatus(item.status ?? "pendiente");
        }
    }, [item]);


    async function setStatus(status: AnimeStatus) {
        try {
            setCurrentStatus(status);
            const updated = await updateAnime(item._id, { status });
            toast.success('Status was updated successfully.');
            onChanged(updated);
        } catch (e: any) {
            toast.error(e?.response?.data?.message ?? 'Failed to update status.');
        }
    }


    async function setChatpter() {
        try{
            setCurrentStatus("en pausa")
            const updated = await updateAnime(item._id, { chapterPaused });
            setChapterPaused(updated.chapterPaused);
            toast.success('Chapter where you left off updated.');
            onChanged(updated);
        } catch (e: any) {
            toast.error(e?.response?.data?.message ?? 'Failed to update chapter.');
        }
    }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60" onClick={onClose} />
        <div className="relative bg-card border border-border rounded-lg maritime-shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-slate-950absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl rounded-t-3xl border border-slate-800 bg-slate-950 p-4 shadow-2xl sm:inset-0 sm:my-auto sm:rounded-3xl sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Quick Edit</h2>
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
                    <div className='grid grid-cols-3 gap-2 p-4 border-b border-border'>
                        <Button variant={currentStatus === "pendiente" ? "pending" : "secondary"} onClick={() => setStatus('pendiente')}>
                            Pending
                        </Button>
                        <Button variant={currentStatus === "visto" ? "watched" : "secondary"} onClick={() => setStatus('visto')}>
                            Watched
                        </Button>
                        <Button variant={currentStatus === "siguiendo" ? "following" : "secondary"} onClick={() => setStatus('siguiendo')}>
                            Following
                        </Button>
                        <Button variant={currentStatus === "en pausa" ? "onhold" : "secondary"} onClick={() => setStatus('en pausa')}>
                            On Hold
                        </Button>
                        <Button variant={currentStatus === "cancelado" ? "cancelled" : "secondary"} onClick={() => setStatus('cancelado')}>
                            Droped
                        </Button>
                    </div>
                    
                    {currentStatus === "en pausa" && (
                        <div className="flex flex-col gap-4">
                            <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                                Enter the chapter of the anime where you left off
                            </div>

                            <input
                            type="text"
                            value={chapterPaused}
                            onChange={(e) => setChapterPaused(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none ring-slate-900/10 focus:border-slate-900 focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10 dark:focus:border-slate-100"
                            />

                            <Button variant="secondary" onClick={() => setChatpter()}>
                                Save Chapter
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            </div>
            
            {/* Actions */}
            <div className="p-4 border-t border-border">
                <Button variant='secondary' onClick={onClose} className="w-full">
                    Close
                </Button>
            </div>
        </div>
    </div>,
    document.body
  );
};