import { Button, Form, Input } from 'components';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentProfileState,
  hasProfilesState,
  profilesState,
} from 'recoil/profiles/atoms';
import { userState } from 'recoil/user/atoms';
import {
  deleteAccount,
  getUserProfiles,
  updateDatabase,
} from 'services/firebase/firestore';
import { apiTmdb } from 'api';
import { Profile } from 'types';
import { catalogState } from 'recoil/apiMovie/atoms';

function CreateProfile() {
  const user = useRecoilValue(userState);
  const [, setProfiles] = useRecoilState(profilesState);
  const [, setHasProfiles] = useRecoilState(hasProfilesState);
  const profiles = useRecoilValue(profilesState);
  const hasDisplayName = profiles?.length > 0 ? null : user?.displayName;

  const handleCreateProfile = (e: React.FormEvent) => {
    const form = document.getElementById('profile-form') as HTMLFormElement;
    const [displayName, photo, theme, isKidsProfile] = Object.values(form);

    const newProfile = {
      displayName: displayName.value,
      theme: theme.value,
      photo: photo.value,
      kidsProfile: isKidsProfile.checked,
      favoriteMovies: null,
      favoriteGenres: null,
    } as Profile;

    e.preventDefault();

    getUserProfiles()
      .then((userProfile) => {
        newProfile.id = userProfile?.profiles.length ?? 0;
        setHasProfiles(true);

        if (userProfile) {
          const addProfile = userProfile.length > 0
            ? { profiles: [newProfile] }
            : {
              profiles: [...userProfile.profiles, newProfile],
            };

          updateDatabase('profiles', addProfile)
            .then(() => {
              setProfiles(addProfile.profiles);
            })
            .catch((error) => console.error(error));
        } else {
          const addProfile = {
            profiles: [newProfile],
          };

          updateDatabase('profiles', addProfile)
            .then(() => {
              setProfiles([newProfile]);
            })
            .catch((error) => console.error(error));
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <h1>Crie seu perfil</h1>
      <Form id="profile-form" onSubmit={handleCreateProfile}>
        <h3>Nome de perfil</h3>
        <Input
          type="text"
          placeholder="Nome do perfil"
          defaultValue={hasDisplayName ?? ''}
          required
        />
        <h3>Escolha sua foto de perfil</h3>
        <select name="photo" defaultValue="photo1">
          <option value="photo1">Foto 1</option>
          <option value="photo2">Foto 2</option>
          <option value="photo3">Foto 3</option>
        </select>
        <h3>Escolha seu tema</h3>
        <select name="theme" defaultValue="theme1">
          <option value="theme1">Tema 1</option>
          <option value="theme2">Tema 2</option>
          <option value="theme3">Tema 3</option>
        </select>
        <h3>
          Perfil kids
          <input type="checkbox" />
        </h3>
        <Button type="submit">Criar perfil</Button>
      </Form>
    </>
  );
}

function SelectProfile() {
  const profiles = useRecoilValue(profilesState);
  const [, setHasProfile] = useRecoilState(hasProfilesState);
  const [, setUser] = useRecoilState(userState);
  const [, setCurrentProfile] = useRecoilState(currentProfileState);
  const [, setCatalog] = useRecoilState(catalogState);

  const deleteUser = () => {
    setHasProfile('loading');
    setUser(null);
    deleteAccount();
  };

  const handleCurrentProfile = (profile: Profile) => {
    const stringProfile = JSON.stringify(profile);

    setCurrentProfile(profile);
    localStorage.setItem('current_profile', stringProfile);

    apiTmdb().then((catalog) => {
      if (catalog) {
        const stringCatalog = JSON.stringify(catalog);
        setCatalog(catalog);
        localStorage.setItem('current_catalog', stringCatalog);
      }
    });
  };

  return (
    <>
      <h1>Selecione seu Perfil</h1>
      <div>
        {profiles?.map((profile) => (
          <div key={profile.id}>
            <Link to="/home" onClick={() => handleCurrentProfile(profile)}>
              <p>{profile.photo}</p>
              <p>{profile.displayName}</p>
            </Link>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setHasProfile(false)}>
        Criar outro perfil
      </button>
      <button type="button" onClick={() => deleteUser()}>
        Deletar
      </button>
    </>
  );
}

export function ProfilePage() {
  const [, setProfiles] = useRecoilState(profilesState);
  const [, setHasProfiles] = useRecoilState(hasProfilesState);
  const hasProfiles = useRecoilValue(hasProfilesState);
  const handleProfilePage = () => (hasProfiles ? <SelectProfile /> : <CreateProfile />);

  useEffect(() => {
    getUserProfiles().then((data) => {
      const dataProfiles = data?.profiles.length > 0 ? data?.profiles : null;

      if (dataProfiles) {
        setHasProfiles(true);
      } else {
        setHasProfiles(false);
      }

      setProfiles(dataProfiles);
    });
  }, [setHasProfiles, setProfiles]);

  return hasProfiles !== 'loading' ? handleProfilePage() : null;
}
