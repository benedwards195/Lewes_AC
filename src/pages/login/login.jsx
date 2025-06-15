import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, getUserProfile } from "../../../src/firebase";
import { InputField } from "../input-field/input-field";


export const Login = () => {
    const [data, setData] = useState({ username: "", email:"", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();


const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
    e.preventDefault();

     try {
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    const uid = userCredential.user.uid;
    const profile = await getUserProfile(uid);
    console.log("User profile from Firestore:", profile);
    
    // Optional: Save to localStorage or context
    localStorage.setItem("user", JSON.stringify(userCredential.user));
    localStorage.setItem("profile", JSON.stringify(profile));
    navigate("/home");
  } catch (err) {
    setError("Invalid login credentials.");
  }
    // if (data.email.includes("@") && data.password === "123456") {
    //     localStorage.setItem("user", JSON.stringify(data));
    //     navigate("/home");
    // } else {
    //     setError("Invalid login credentials.");
    // }

    // await signInWithEmailAndPassword(auth, data.email, data.password);
}

return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <InputField label="Username or email" name="email" value={data.email || data.username} onChange={handleChange} />
        <InputField label="Password" name="password" type="password" value={data.password} onChange={handleChange} />
        {error && <small className="error">{error}</small>}
        <button type="submit">Login</button>
        <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
      </form>
    </div>
  );
}