import { atom } from 'recoil';
import { User } from 'types';

export const userState = atom<User | null>({
  key: 'user',
  default: null,
});

export const hasUserState = atom<boolean | 'loading'>({
  key: 'hasUser',
  default: 'loading',
});
