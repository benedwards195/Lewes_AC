import { signOut } from "firebase/auth";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../../firebase";

export const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
  signOut(auth).then(() => {
    localStorage.removeItem("user");
    navigate("/login");
  }).catch((error) => {
    console.error("Sign out error:", error.message);
  });
}, [navigate]);

  return (
    <div>
      <p>Signing out...</p>
    </div>
  );
};


