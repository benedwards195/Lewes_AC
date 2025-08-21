import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { db } from "./firebase";
import { TrainingContext } from "./TrainingContext";

export const useSignups = (dayCollection) => {
  const { names, dispatch } = useContext(TrainingContext);
  const { user } = useContext(AuthContext);

  const colRef = collection(db, dayCollection);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(colRef);
      const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      dispatch({ type: "LOAD", payload: loaded });
    })();
  }, [dayCollection]);

  const handleSubmit = async (text, editingId, resetInput) => {
    if (!user) return alert("Log in first!");
    if (names.some(n => n.userId === user.uid && n.text === text)) {
      return alert("You’re already signed up!");
    }
    if (editingId) {
      await updateDoc(doc(db, dayCollection, editingId), { text });
      dispatch({ type: "EDIT_NAME", payload: { id: editingId, text } });
    } else {
      const docRef = await addDoc(colRef, {
        text,
        userId: user.uid,
        displayName: user.displayName || user.email
      });
      dispatch({ type: "ADD_NAME", payload: { id: docRef.id, text, userId: user.uid, displayName: user.displayName || user.email } });
    }
    resetInput();
  };

  const handleRemove = async (id) => {
    await deleteDoc(doc(db, dayCollection, id));
    dispatch({ type: "REMOVE_NAME", payload: id });
  };

  return { names, handleSubmit, handleRemove };
};
