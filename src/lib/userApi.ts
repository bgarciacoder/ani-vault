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

export async function updateAnimeStatus(id: string, status: AnimeStatus) {
  const { data } = await api.put<AnimeListItem>(`/user/anime-list/${id}`, { status });
  return data;
}

export async function updateAnimeChapterPaused(id: string, chapterPaused: string) {
  const { data } = await api.put<AnimeListItem>(`/user/anime-list/update-chapter/${id}`, { chapterPaused });
  return data;
}

export async function deleteAnimeFromList(id: string) {
  await api.delete(`/user/anime-list/${id}`);
}

