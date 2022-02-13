import '../styles/globals.css'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../components/firebase';
import Login from './Login';
import Loading from '../components/Loading';
import { useEffect } from 'react';

import { doc, setDoc, serverTimestamp  } from "firebase/firestore";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(async () => {
    if(user) {
      const data = {
        email: user.email,
        lastSeen: serverTimestamp(),
        photoURL: user.photoURL
      }
      await setDoc(doc(db, "users", user.uid), data, { merge: true });

      // collection(db, 'users').doc(user.uid).set({
      //   email: user.email,
      //   lastSeen: FieldValue.serverTimestamp(),
      //   photoURL: user.photoURL
      // }, { merge : true })
    }
  }, [user]);

  if(loading) return <Loading />
  if(!user) return <Login />;

  return <Component {...pageProps} />
}

export default MyApp
