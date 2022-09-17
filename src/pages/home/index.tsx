import { signOut } from 'firebase/auth';
import { auth } from 'services/firebase';
import {
  useRecoilState, useRecoilValue,
} from 'recoil';
import { currentProfileState, profilesState } from 'recoil/profiles/atoms';
import { userState } from 'recoil/user/atoms';
import { useTmdb } from 'api';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const api = useTmdb();
  const [, setUser] = useRecoilState(userState);
  const [, setProfiles] = useRecoilState(profilesState);
  const [, setCurrentProfile] = useRecoilState(currentProfileState);
  const currentProfile = useRecoilValue(currentProfileState);
  const navigate = useNavigate();

  const signOutUser = () => {
    signOut(auth);
    setUser(null);
    setProfiles([]);
    setCurrentProfile(null);
    localStorage.clear();
  };

  api.then();

  useEffect(() => {
    const currentProfileStorage = localStorage.getItem('current_profile');
    if (currentProfileStorage) {
      setCurrentProfile(JSON.parse(currentProfileStorage));
    } else {
      navigate('/profiles');
    }
  }, [setCurrentProfile, navigate]);

  return (
    currentProfile && (
    <>
      <h1>
        {`Olá, ${currentProfile?.displayName}`}
      </h1>
      <button type="button" onClick={() => signOutUser()}>Fazer logoff</button>
    </>
    )
  );
}
