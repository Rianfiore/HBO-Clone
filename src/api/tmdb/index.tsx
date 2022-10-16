import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Genre, GenreWithMovies, Movie } from 'types';

const credits = (creditId: string) => ({ details: `/credit/${creditId}` });

const discover = {
  movie: {
    url: '/discover/movie?',
    query: (sortBy?: string, withGenres?: number, includeVideo?: boolean) => `${sortBy ? `&sort_by=${sortBy}` : ''}${
      includeVideo ? '&include_video=true' : ''
    }${withGenres ? `&with_genres=${withGenres}` : ''}`,
  },
  tv: { url: '/discover/tv' },
};

const find = (externalId: string) => ({ find: `/find/${externalId}` });

const genres = {
  movie: '/genre/movie/list',
  tv: '/genre/tv/list',
};

const movies = (movieId: string) => ({
  details: `/movie/${movieId}`,
  credits: `/movie/${movieId}/credits`,
  image: `/movie/${movieId}/images`,
  lists: `/movie/${movieId}/lists`,
  videos: `/movie/${movieId}/videos`,
});

const people = (personId: string) => ({
  details: `/person/${personId}`,
  images: `/person/${personId}/images`,
  movieCredits: `/person/${personId}/movie_credits`,
});

const search = () => ({
  movie: '/search/movie',
  person: '/search/person',
});

const tmdbConfig = {
  apiKey: process.env.REACT_APP_TMDB_KEY,
  baseURL: 'https://api.themoviedb.org/3',
  endpoints: {
    credits,
    discover,
    find,
    genres,
    movies,
    people,
    search,
  },
};

// implementar filmes relacionados com movie lists

const { endpoints } = tmdbConfig;

const generateArrayNumber = (length: number): number[] => {
  const generateArray = [];

  for (let i = 1; i <= length; i += 1) {
    generateArray.push(i);
  }

  return generateArray;
};

const createCatalog = async () => {
  const url = `${tmdbConfig.baseURL}${endpoints.genres.movie}?api_key=${tmdbConfig.apiKey}&language=pt-BR`;
  const totalPages = generateArrayNumber(14);
  const genresApi = await (await axios.get(url)).data.genres;

  const genresApiWithMovies : GenreWithMovies[] = await Promise.all(
    genresApi.map(async (genreApi: Genre) => {
      const moviesByIdUrl = (currentPage: number) => `${tmdbConfig.baseURL}${endpoints.discover.movie.url}api_key=${tmdbConfig.apiKey}&language=pt-BR&with_genres=${genreApi.id}&sort_by=popularity.desc&page=${currentPage}`;

      const allMoviesByGenre : Movie[] = [];

      await Promise.all(
        totalPages.map(
          async (currentPage: number) => {
            const moviesByGenre = await (await axios.get(moviesByIdUrl(currentPage))).data.results;

            moviesByGenre.forEach((movie : Movie) => {
              allMoviesByGenre.push(movie);
            });
          },
        ),
      );

      return { id: genreApi.id, name: genreApi.name, movies: allMoviesByGenre } as GenreWithMovies;
    }),
  );

  return genresApiWithMovies;
};

const defaultQueryFn = async (): Promise<GenreWithMovies[] | null> => (
  createCatalog()
);

const api = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

export const apiTmdb = () => api.fetchQuery({}) as Promise< GenreWithMovies[]| null>;
