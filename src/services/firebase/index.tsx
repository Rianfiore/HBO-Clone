// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   Auth,
//   signInWithEmailAndPassword,
//   User,
//   updateProfile,
//   signOut,
//   deleteUser,
// } from "firebase/auth";
// import {
//   getFirestore,
//   getDocs,
//   collection,
//   deleteDoc,
//   doc,
//   getDoc,
//   setDoc,
//   updateDoc,
// } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { addUser } from "redux/sliceUser";

// import { firebaseProps } from "services/hooks/types";
// import { ProfileType } from "types";

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: 'hbo-max-64100.firebaseapp.com',
  projectId: 'hbo-max-64100',
  storageBucket: 'hbo-max-64100.appspot.com',
  messagingSenderId: '574749029266',
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: 'G-TDJFTNZ1D1',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export { app, auth };

// const userCollectionRef = collection(db, "users");
// const usersDatabase = async () =>
//   await getDocs(userCollectionRef).then((db) =>
//     db.docs.map((doc) => doc.data())
//   );

// export const useAuth = () => {
//   const { auth } = useFirebase();
//   const [userProfiles, setUserProfiles] = useState<ProfileType[]>();
//   const [hasProfile, setHasProfile] = useState<boolean | null>(null);

//   useEffect(() => {
//     if (auth.currentUser === null) return;

//     const profileDoc = doc(db, "profiles", auth.currentUser.uid);

//     getDoc(profileDoc).then((profile) => {
//       const currentProfiles = profile.data();

//       setUserProfiles(currentProfiles?.profiles);
//     });
//   }, [auth.currentUser]);

//   return { userProfiles, setUserProfiles, hasProfile, setHasProfile };
// };

// export const useFirebase = () => {
//   const showUsers = async () => {
//     console.log(await usersDatabase);
//   };

//   const getUserProfiles = async () => {
//     if (auth.currentUser) {
//       const docProfile = doc(db, "profiles", auth.currentUser.uid);

//       return (await getDoc(docProfile)).data();
//     }
//   };

//   const checkUserProfiles = async (): Promise<ProfileType[] | undefined> => {
//     if (auth.currentUser) {
//       const profileDoc = doc(db, "profiles", auth.currentUser.uid);
//       const userProfiles = (await getDoc(profileDoc)).data();
//       console.log(userProfiles);
//       return userProfiles?.profiles;
//     }
//   };

//   const getUserReferenceOnDatabase = async () =>
//     usersDatabase().then((users) =>
//       users.find((user) => user.uid === auth.currentUser?.uid)
//     );

//   const updateDatabase = async (collection: string, data: object) => {
//     if (auth.currentUser) {
//       const docProfile = doc(db, collection, auth?.currentUser.uid);

//       await updateDoc(docProfile, {
//         ...data,
//       });
//     }
//   };

//   const createUser = ({ ...props }: firebaseProps) => {
//     switch (props.type) {
//       case "email":
//         createWithEmail(auth);
//         break;
//       case "google":
//         break;
//       default:
//         break;
//     }

//     function createWithEmail(auth: Auth) {
//       createUserWithEmailAndPassword(auth, props.email, props.password)
//         .then(() => {
//           createUserOnDataBase();
//           alert("Usuário criado com sucesso!");
//         })
//         .catch((error) => {
//           const errorCode = error.code;

//           if (errorCode === "auth/invalid-email") {
//             alert("Dados inválidos. Tente novamente");
//           } else {
//             alert("Esse email já existe. Tente novamente");
//           }

//           console.error(error);
//         });

//       async function createUserOnDataBase() {
//         if (auth.currentUser) {
//           updateProfile(auth.currentUser, {
//             displayName: `${props.name} ${props.surname}`,
//           }).then(async () => {
//             if (auth.currentUser) {
//               const docUser = doc(db, "users", auth.currentUser.uid);
//               const docProfile = doc(db, "profiles", auth.currentUser.uid);

//               await setDoc(docUser, {
//                 email: auth.currentUser.email,
//                 uid: auth.currentUser.uid,
//                 accessToken: await auth.currentUser.getIdToken(),
//                 phoneNumber: auth.currentUser.phoneNumber,
//                 photo: auth.currentUser.photoURL,
//                 displayName: auth.currentUser.displayName,
//                 name: props.name,
//                 surname: props.surname,
//                 emailVerified: auth.currentUser.emailVerified,
//               });

//               await setDoc(docProfile, {
//                 uid: auth.currentUser.uid,
//                 profiles: [],
//               });
//             }
//           });
//         }
//       }
//     }
//   };

//   const loginUser = ({ type, email, password }: firebaseProps) => {
//     switch (type) {
//       case "email":
//         loginWithEmail(auth);
//         break;
//       case "google":
//         break;
//       default:
//         break;
//     }

//     function loginWithEmail(auth: Auth) {
//       signInWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//           const user = userCredential.user;
//           validateLoginOnDataBase(user);
//         })
//         .catch((error) => {
//           const errorCode = error.code;
//           const errorMessage = error.message;

//           alert("Email ou senha incorreta. Tente novamente");
//           console.error(errorCode, errorMessage);
//         });

//       async function validateLoginOnDataBase(data: User) {
//         await getDocs(userCollectionRef)
//           .then((db) => {
//             const user = db.docs
//               .find((doc) => doc.data().uid === data.uid)
//               ?.data();

//             if (user !== undefined) {
//               alert("Logado com sucesso!");
//             } else {
//               throw new Error("user not found");
//             }
//           })
//           .catch((error) => {
//             alert("Usuário não encontrado. Tente novamente");
//             console.error(error);
//           });
//       }
//     }
//   };

//   const signOutUser = () => {
//     signOut(auth)
//       .then(() => {
//         alert("Usuário desconectado");
//       })
//       .catch((error) => console.error(error));
//   };

//   const deleteAccount = () => {
//     const user = auth.currentUser;
//     if (user) {
//       deleteUserOnDatabase();
//       deleteUser(auth.currentUser)
//         .then(() => {
//           alert("Usuário deletado.");
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }

//     async function deleteUserOnDatabase() {
//       getUserReferenceOnDatabase().then(async (ref) => {
//         if (ref) {
//           const docRef = doc(db, "users", ref.uid);
//           const docProfile = doc(db, "profiles", ref.uid);
//           const docSnap = await getDoc(docRef);

//           if (!docSnap.exists()) {
//             console.error("Document does not exists");
//             return;
//           }

//           await deleteDoc(docRef).catch((error) => {
//             alert("Operação mal sucedida, erro: " + error);
//           });

//           await deleteDoc(docProfile).catch((error) => {
//             alert("Operação mal sucedida, erro: " + error);
//           });
//         }
//       });
//     }
//   };

//   return {
//     auth,
//     createUser,
//     loginUser,
//     signOutUser,
//     deleteAccount,
//     showUsers,
//     checkUserProfiles,
//     getUserProfiles,
//     getUserReferenceOnDatabase,
//     updateDatabase,
//   };
// };
