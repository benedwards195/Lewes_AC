// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";


// Your Firebase configuration object (fill this with your actual config)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Function to sign up a user and save extra profile data
export const signUpUser = async (email, password, username, address, postcode, firstName, surname ) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    try {
    // Store additional user info in Firestore under "users" collection with user's uid
    await setDoc(doc(db, "users", user.uid), {
      username,
      address,
      postcode,
      email: user.email,
      firstName,
      surname,
      createdAt: new Date()
    });

    return user;
  } catch (firestoreError) {
      console.error("Firestore write failed:", firestoreError);
      // You might still want to proceed or clean up the Auth user here.
    }

    return user;
  } catch (authError) {
    console.error("Firebase signup failed:", authError);
    throw authError;
  }
};

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


