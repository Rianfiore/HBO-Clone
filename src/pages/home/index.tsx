import { signOut } from 'firebase/auth';
import { auth } from 'services/firebase';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentProfileState, profilesState } from 'recoil/profiles/atoms';
import { userState } from 'recoil/user/atoms';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { catalogState } from 'recoil/apiMovie/atoms';

import { MovieCategory } from 'components/movieCategory';
import { GenreWithMovies } from 'types';

export function HomePage() {
  const [, setUser] = useRecoilState(userState);
  const [, setProfiles] = useRecoilState(profilesState);
  const [, setCurrentProfile] = useRecoilState(currentProfileState);
  const [, setCatalog] = useRecoilState(catalogState);
  const currentProfile = useRecoilValue(currentProfileState);
  const catalog = useRecoilValue(catalogState);
  const navigate = useNavigate();

  const signOutUser = () => {
    signOut(auth);
    setUser(null);
    setProfiles([]);
    setCurrentProfile(null);
    localStorage.clear();
  };

  useEffect(() => {
    const currentProfileStorage = localStorage.getItem('current_profile');
    const currentCatalogStorage = localStorage.getItem('current_catalog');

    if (currentCatalogStorage) {
      setCatalog(JSON.parse(currentCatalogStorage));
    }

    if (currentProfileStorage) {
      setCurrentProfile(JSON.parse(currentProfileStorage));
    } else {
      navigate('/profiles');
    }
  }, [setCurrentProfile, navigate, setCatalog]);

  return (
    <>
      {currentProfile && (
      <>
        <h1>{`Olá, ${currentProfile?.displayName}`}</h1>
        <button type="button" onClick={() => signOutUser()}>
          Fazer logoff
        </button>
      </>
      )}
      {catalog && (
        catalog.map((genre : GenreWithMovies) => <MovieCategory key={genre.id} title={genre.name} movies={genre.movies} genre={genre} />)
      )}
    </>
  );
}
