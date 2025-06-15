// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";


// Your Firebase configuration object (fill this with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyB5pxtVHbbrNWxAcRAxckP2KITl_pYV04Q",
  authDomain: "lewes-ac.firebaseapp.com",
  projectId: "lewes-ac",
  storageBucket: "lewes-ac.firebasestorage.app",
  messagingSenderId: "948132451521",
  appId: "1:948132451521:web:09284b61d49568d82e7040"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Function to sign up a user and save extra profile data
export async function signUpUser(email, password, username, address, postcode ) {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user info in Firestore under "users" collection with user's uid
    await setDoc(doc(db, "users", user.uid), {
      username,
      address,
      postcode,
      createdAt: new Date()
    });

    return user;
  } catch (error) {
    // You can log error or handle it differently here
    throw error;
  }
}

// Optional: function to get user profile from Firestore by uid
export async function getUserProfile(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("No user profile found");
  }
}
