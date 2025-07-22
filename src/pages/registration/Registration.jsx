import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpUser } from "../../../src/firebase";
import { InputField } from "../input-field/input-field";
import './Registration.css';


export const Registration = () => {
    const [data, setData]=useState({
    firstName:"",
    surname:"",
    username: "",
    address: "",
    postcode: "",
    email: "",
    password: "",
    confirmPassword: ""
})

const navigate = useNavigate();
const [errors, setErrors] = useState({})

 const handleChange = (event) => {
       setData({ ...data, [event.target.name]: event.target.value });
    }

    const validate = () => {
        const newErrors = {};
        if (!data.firstName) newErrors.firstName = "First name required";
        if (!data.surname) newErrors.surname = "Surname required";
        if (!data.username) newErrors.username = "Username required";
        if (!data.address) newErrors.address = "Address required";
        if (data.postcode.length < 5 || data.postcode.length > 7) newErrors.postcode = "Invalid Postcode";
        if (!data.email.includes("@")) newErrors.email = "Invalid email"
        if (data.password.length < 6) newErrors.password = "Min 6 characters";
        if (data.password !== data.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
        setErrors(newErrors);
        
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

  try {
    const user = await signUpUser(
       data.email,
       data.password,
       data.username,
       data.address,
       data.postcode,
       data.firstName,
       data.surname
    );


    // localStorage.setItem("user", JSON.stringify(user));
    console.log("Registered user:", user);
    alert("User registered!");
    // Optionally redirect after signup
      navigate('/home');

  } catch (error) {
  if (error.code === "auth/email-already-in-use") {
    alert("That email is already in use.");
  } else if (error.code === "auth/weak-password") {
    alert("Password should be at least 6 characters.");
  } else {
    alert("Failed to register user. Please try again.");
  }
}

    }

    

    return (
        <>
        <div className="auth-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <InputField label="First Name" name="firstName" value={data.firstName} onChange={handleChange} error={errors.firstName} />
        <InputField label="Surname" name="surname" value={data.surname} onChange={handleChange} error={errors.surname} />
        <InputField label="Username" name="username" value={data.username} onChange={handleChange} error={errors.username} />
        <InputField label="Address" name="address" value={data.address} onChange={handleChange} error={errors.address} />
        <InputField label="Post Code" name="postcode" value={data.postcode} onChange={handleChange} error={errors.postcode} />
        <InputField label="Email" name="email" value={data.email} onChange={handleChange} error={errors.email} />
        <InputField label="Password" name="password" type="password" value={data.password} onChange={handleChange} error={errors.password} />
        <InputField label="Confirm Password" name="confirmPassword" type="password" value={data.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        <button className="member-signup" type="submit">Register</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
        </>
    )
}

