import { atom } from 'recoil';
import { Movie } from 'types';

export const catalogState = atom<Movie[] | null>({
  key: 'catalog',
  default: null,
});
