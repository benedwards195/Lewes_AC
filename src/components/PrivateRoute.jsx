import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

export default function PrivateRoute({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  // Wait until Firebase finishes checking auth
  if (!authChecked) return <p>Loading...</p>;

  return user ? children : <Navigate to="/login" replace />;
}
