import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { auth, getUserProfile } from "../../firebase";
import { InputField } from "../input-field/input-field";
import './login.css';

export const Login = () => {
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  // 🔍 Checks if already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);


  if (checking) return <p>Loading...</p>;

  // Redirects if user is already logged in
  if (user) {
    return <Navigate to="/home" replace />;
  }

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const uid = userCredential.user.uid;
      const profile = await getUserProfile(uid);

      console.log("User profile from Firestore:", profile);

      login(userCredential.user);
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      localStorage.setItem("profile", JSON.stringify(profile));
      navigate("/home");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setError("User not found.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError("Failed to log in.");
      }
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Username or email"
          name="email"
          value={data.email || data.username}
          onChange={handleChange}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={data.password}
          onChange={handleChange}
        />
        {error && <small className="error">{error}</small>}
        <button className="signin" type="submit">
          Login
        </button>
        <p>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};
