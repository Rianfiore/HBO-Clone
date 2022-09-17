import { QueryClient, QueryFunctionContext, QueryKey } from '@tanstack/react-query';
import axios from 'axios';
import { Genre, Genres, Movie } from 'types';

const credits = (creditId : string) => ({ details: `/credit/${creditId}` });

const discover = {
  movie: (sortBy? : string, includeVideo? : boolean) => `/discover/movie${sortBy ? `?sort_by=${sortBy}` : ''}${includeVideo ? '&include_video=true' : ''}`,
  tv: '/discover/tv',
};

const find = (externalId : string) => ({ find: `/find/${externalId}` });

const genres = {
  movie: '/genre/movie/list',
  tv: '/genre/tv/list',
};

const movies = (movieId : string) => ({
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

const { endpoints } = tmdbConfig;

type apiProps = {
  catalog: Movie[] | null,
  genres: Genre[],
  moviesByGenres: Genres | null
}

export const useTmdb = () => {
  const defaultQueryFn = async () : Promise<apiProps | null> => {
    const catalogGenres = async () => {
      const url = `${tmdbConfig.baseURL}${endpoints.genres.movie}?api_key=${tmdbConfig.apiKey}`;
      const result: Genre[] = [];

      await axios.get(url).then((res) => {
        result.push(...res.data.genres);
      });

      return result;
    };

    const catalogMoviesByGenres = () => {
      const currentGenres : Genres = [];
      catalogGenres().then((resGenres) => {
        resGenres.map(async (resGenre) => {
          const maxPages = 12;
          const currentGenreMovies : Movie[] = [];
          const currentGenre = {
            [resGenre.name]: {
              id: resGenre.id,
              movies: currentGenreMovies,
            },
          };

          for (let page = 1; page <= maxPages; page += 1) {
            const url = `${tmdbConfig.baseURL}${endpoints.discover.movie('popularity.desc', true)}&api_key=${tmdbConfig.apiKey}&with_genres=${resGenre.id}&page=${page}`;

            axios.get(url).then((res) => {
              currentGenreMovies.push(...res.data);
            });
          }

          currentGenres.action.movies(currentGenre);

          console.log(currentGenres);
          return null;
        });
      });

      // catalogGenres().map((catalogGenre) => {
      //   // const result = catalogMovies.filter((catalogMovie) => catalogGenre.id === catalogMovie.id);

      //   console.log(catalogGenre.id);

      //   return null;
      // });
    };

    catalogMoviesByGenres();

    return {
      catalog: null,
      genres: await catalogGenres(),
      moviesByGenres: null,
    };
  };

  const api = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: defaultQueryFn,
      },
    },
  });

  const fullCatalog = api.fetchQuery;

  return fullCatalog;
};
