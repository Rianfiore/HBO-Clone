import { Genre, Movie } from 'types';

export interface MovieCategoryProps {
  title: string
  subtitle?: string
  genre?: Genre
  movies?: Movie[] | null
}
