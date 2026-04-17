import axios from 'axios';

export const jikan = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
});

export type JikanAnime = {
  mal_id: number;
  title: string;
  images?: { jpg?: { image_url?: string } };
};

export type JikanAnimeDetails = {
  mal_id: number;
  title: string;
  airing?: boolean;
  aired?: {
    from?: string | null;
    to?: string | null;
    prop?: {
      from?: { day?: number | null; month?: number | null; year?: number | null };
      to?: { day?: number | null; month?: number | null; year?: number | null };
    } | null;
    string?: string | null;
  } | null;
  broadcast?: {
    day?: string | null;
    time?: string | null; // "01:29"
    timezone?: string | null;
    string?: string | null;
  } | null;
};

export type JikanAnimeFullDetails = {
  mal_id: number;
  title: string;
  title_synonyms?: string[];
  title_english?: string;
  title_japanese?: string;
  images?: { jpg?: { image_url?: string; large_image_url?: string; small_image_url?: string }; webp?: { image_url?: string; large_image_url?: string; small_image_url?: string } };
  synopsis?: string;
  background?: string;
  airing?: boolean;
  aired?: {
    from?: string;
    to?: string | null;
    prop?: { from?: { day?: number; month?: number; year?: number }; to?: { day?: number; month?: number; year?: number } };
    string?: string;
  };
  duration?: string;
  rating?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  status?: string;
  type?: string;
  episodes?: number;
  source?: string;
  genres?: Array<{ mal_id: number; type: string; name: string; url: string }>;
  themes?: Array<{ mal_id: number; type: string; name: string; url: string }>;
  studios?: Array<{ mal_id: number; type: string; name: string; url: string }>;
  season?: string;
  year?: number;
  broadcast?: {
    day?: string;
    time?: string;
    timezone?: string;
    string?: string;
  };
};

export async function fetchAnimePage(page: number, q?: string) {
  const params: Record<string, string | number> = { page, limit: 24 };
  if (q?.trim()) params.q = q.trim();
  const { data } = await jikan.get('/anime', { params });
  return data as {
    data: JikanAnime[];
    pagination: { current_page: number; last_visible_page: number; has_next_page: boolean };
  };
}

export async function fetchAnimeDetails(day: string) {
  const params: Record<string, string | boolean> = { "sfw": true, "filter": day };
  const { data } = await jikan.get(`/schedules`, { params});
  return data as { data: JikanAnimeDetails[] };
}

export async function fetchAnimeById(animeId: number) {
  const { data } = await jikan.get(`/anime/${animeId}`);
  return data.data as JikanAnimeFullDetails;
}

