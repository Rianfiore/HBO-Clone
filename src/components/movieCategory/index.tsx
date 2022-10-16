import { Movie } from 'components/movie';
import { Movie as MovieType } from 'types';
import { MovieCategoryProps } from './types';

export function MovieCategory({
  title, subtitle, genre, movies,
} : MovieCategoryProps) {
  return (
    <>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {movies.map((movie : MovieType) => <Movie key={movie.id} title={movie.title} description={movie.overview} poster={movie.poster_path} backdrop={movie.backdrop_path} />)}
    </>
  );
}
