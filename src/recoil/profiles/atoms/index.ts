import { atom } from 'recoil';
import { Profile } from 'types';

export const profilesState = atom<Profile[] | []>({
  key: 'profiles',
  default: [],
});

export const hasProfilesState = atom <boolean | 'loading'>({
  key: 'hasProfiles',
  default: 'loading',
});

export const currentProfileState = atom <Profile | null>({
  key: 'currentProfile',
  default: null,
});
