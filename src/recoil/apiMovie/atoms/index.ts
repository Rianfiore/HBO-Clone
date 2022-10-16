import { atom } from 'recoil';
import { GenreWithMovies } from 'types';

export const catalogState = atom<GenreWithMovies[] | null>({
  key: 'catalog',
  default: null,
});
