import { api } from './api';
import type { AnimeListItem, AnimeStatus } from '../types';

export async function getAnimeList() {
  const { data } = await api.get<AnimeListItem[]>('/user/anime-list');
  return data;
}

export async function addAnimeToList(input: { animeId: number; title: string; image: string }) {
  const { data } = await api.post<AnimeListItem>('/user/anime-list', input);
  return data;
}

export async function updateAnime(id: string, data: Partial<AnimeListItem>) {
  const { data: response } = await api.put<AnimeListItem>(`/user/anime-list/${id}`, data );
  return response;
}

export async function deleteAnimeFromList(id: string) {
  await api.delete(`/user/anime-list/${id}`);
}

