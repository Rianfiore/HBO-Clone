import { LoginPage, HomePage, ProfilePage } from 'pages';
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import { auth } from 'services/firebase';
import { useRecoilState } from 'recoil';
import { hasUserState, userState } from 'recoil/user/atoms';
import { User } from 'types';

function AuthRoutes() {
  const hasCurrentProfile = !!localStorage.getItem('current_profile');

  return (
    <Routes>
      <Route path="/profiles" element={<ProfilePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route
        path="*"
        element={
          <Navigate to={hasCurrentProfile ? '/home' : '/profiles'} replace />
        }
      />
    </Routes>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function Router() {
  const [, setUser] = useRecoilState(userState);
  const [hasUser, setHasUser] = useRecoilState(hasUserState);

  auth.onAuthStateChanged((currentUser) => {
    if (currentUser) {
      setHasUser(true);
    } else {
      setHasUser(false);
    }
  });

  useEffect(() => {
    if (hasUser) {
      const userAuth: User = {
        email: auth.currentUser?.email,
        uid: auth.currentUser?.uid,
        displayName: auth.currentUser?.displayName,
        emailVerified: auth.currentUser?.emailVerified,
      };
      setUser(userAuth);
    }
  }, [hasUser, setUser]);

  return (
    <BrowserRouter>
      {hasUser !== 'loading' && (hasUser ? <AuthRoutes /> : <AppRoutes />)}
    </BrowserRouter>
  );
}
