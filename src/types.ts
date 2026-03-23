export type AnimeStatus = 'pendiente' | 'visto' | 'en pausa' | 'cancelado';

export type AnimeListItem = {
  _id: string;
  userId: string;
  animeId: number;
  title: string;
  image: string;
  status: AnimeStatus;
  chapterPaused: string;
  createdAt: string;
  updatedAt: string;
};

