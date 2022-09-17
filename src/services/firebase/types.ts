import { Login } from 'types';

export interface firebaseProps extends Login {
  type: 'email' | 'google'
}
