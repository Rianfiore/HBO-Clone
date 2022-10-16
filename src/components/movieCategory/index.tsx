import { Movie } from 'components/movie';
import { Movie as MovieType } from 'types';
import { MovieCategoryProps } from './types';
import * as S from './styles';

export function MovieCategory({
  title,
  subtitle,
  genre,
  movies,
}: MovieCategoryProps) {
  return (
    <S.MovieCategory>
      <div className="movie-category">
        <h1 className="movie-category__title">{title}</h1>
        {subtitle && <h2 className="movie-category__subtitle">{subtitle}</h2>}
        {movies && (
        <div className="movie-category__movies">
          {movies.map((movie: MovieType) => (
            <Movie
              key={movie.id}
              title={movie.title}
              description={movie.overview}
              poster={movie.poster_path}
              backdrop={movie.backdrop_path}
            />
          ))}
        </div>
        )}
      </div>
    </S.MovieCategory>
  );
}
