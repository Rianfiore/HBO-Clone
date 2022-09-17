import { deleteUser, updateProfile, User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth } from 'services/firebase';
import { Login } from 'types';

const db = getFirestore();

const userCollectionRef = collection(db, 'users');

const usersDatabase = async () => getDocs(userCollectionRef)
  .then((database) => database.docs.map((document) => document.data()));

const updateDatabase = async (collectionUpdate: string, data: object) => {
  if (auth.currentUser) {
    const docProfile = doc(db, collectionUpdate, auth?.currentUser.uid);

    await updateDoc(docProfile, {
      ...data,
    });
  }
};

const createUserOnDatabase = async (registerUser: Login) => {
  if (auth.currentUser) {
    updateProfile(auth.currentUser, {
      displayName: `${registerUser.name} ${registerUser.surname}`,
    }).then(async () => {
      if (auth.currentUser) {
        const docUser = doc(db, 'users', auth.currentUser.uid);
        const docProfile = doc(db, 'profiles', auth.currentUser.uid);

        await setDoc(docUser, {
          email: auth.currentUser.email,
          uid: auth.currentUser.uid,
          accessToken: await auth.currentUser.getIdToken(),
          phoneNumber: auth.currentUser.phoneNumber,
          photo: auth.currentUser.photoURL,
          displayName: auth.currentUser.displayName,
          name: registerUser.name,
          surname: registerUser.surname,
          emailVerified: auth.currentUser.emailVerified,
        });

        await setDoc(docProfile, {
          uid: auth.currentUser.uid,
          profiles: [],
        });
      }
    });
  }
};

const getUserReferenceOnDatabase = async () => usersDatabase()
  .then((users) => users.find((user) => user.uid === auth.currentUser?.uid));

async function checkUserOnDatabase(data: User) {
  await getDocs(userCollectionRef)
    .then((database) => {
      const user = database.docs.find((document) => document.data().uid === data.uid)?.data();

      if (user === undefined) {
        throw new Error('user not found');
      }
    })
    .catch((error) => {
      alert('Usuário não encontrado. Tente novamente');
      console.error(error);
    });
}

const deleteAccount = () => {
  async function deleteUserOnDatabase() {
    getUserReferenceOnDatabase().then(async (ref) => {
      if (ref) {
        const docRef = doc(db, 'users', ref.uid);
        const docProfile = doc(db, 'profiles', ref.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.error('Document does not exists');
          return;
        }

        await deleteDoc(docRef).catch((error) => {
          alert(`Operação mal sucedida, erro: ${error}`);
        });

        await deleteDoc(docProfile).catch((error) => {
          alert(`Operação mal sucedida, erro: ${error}`);
        });
      }
    });
  }

  if (auth.currentUser) {
    deleteUserOnDatabase();
    deleteUser(auth.currentUser)
      .then(() => {
        alert('Usuário deletado.');
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

const getUserProfiles = async () : Promise<DocumentData | undefined> => {
  if (auth.currentUser) {
    const docProfile = doc(db, 'profiles', auth.currentUser.uid);

    return (await getDoc(docProfile)).data();
  }

  return undefined;
};

export {
  db, updateDatabase, createUserOnDatabase, checkUserOnDatabase, deleteAccount, getUserProfiles,
};
