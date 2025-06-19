import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { TrainingContext } from '../../components/TrainingContext';
import { db } from '../../firebase';

import './thursday.css';

export const Thursday = () => {
    const {state, dispatch} = useContext(TrainingContext);
    const names = state.thursday;
    // const [members, setMembers] = useState('');
    const [input, setInput] = useState('');
    const [editingId, setEditingId] = useState(null);

    const colRef = collection(db, 'names-thursday');


    useEffect(() => {
      const getMostRecentThursday = (date = new Date()) => {
    const day = date.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = (day - 4 + 7) % 7;  
    const thursday= new Date(date);
    thursday.setDate(date.getDate() - diff);
    thursday.setHours(0, 0, 0, 0);
    return thursday;
  };

  const fetchAndMaybeReset = async () => {
    const today = new Date();
    const configDoc = doc(db, 'config', 'resetDates');
    const configSnap = await getDoc(configDoc);
    const lastResetStr = configSnap.exists() ? configSnap.data().thursday : null;

    const lastResetDate = lastResetStr ? new Date(lastResetStr) : new Date(0); // fallback to epoch if no lastReset
    const thisWeekThursday = getMostRecentThursday(today);

    if (lastResetDate < thisWeekThursday) {
      // Reset logic
      const snapshot = await getDocs(colRef);
      const batchDeletes = snapshot.docs.map(docItem =>
        deleteDoc(doc(db, 'names-thursday', docItem.id))
      );
      await Promise.all(batchDeletes);

      // Update reset date to today
      await setDoc(configDoc, { thursday: today.toISOString() }, { merge: true });

      // Empty local list
      dispatch({ type: 'LOAD', day: 'thursday', payload: [] });
    } else {
      // Just load the list if reset not needed
      const snapshot = await getDocs(colRef);
      const loaded = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: 'LOAD', day: 'thursday', payload: loaded });
    }
  };

  fetchAndMaybeReset();
}, []);

    const handleSubmit = async () => {
        if (names.length >= 24) {
            alert('Sign up list full');
            return;
        }

        if (input.trim()) {
            if (names.some(n => n.text.trim().toLowerCase() === input.trim().toLowerCase())) {
            alert("That name is already on the list.");
            return;
        }

      if (editingId !== null) {
        await updateDoc(doc(db, 'names-thursday', editingId), { text: input });
        dispatch({ type: 'EDIT_NAME', day: 'thursday', payload: { id: editingId, text: input } });
        setEditingId(null);
      } else {
        const newDoc = await addDoc(colRef, { text: input, done: false });
        dispatch({ type: 'ADD_NAME', day: 'thursday', payload: { id: newDoc.id, text: input, done: false } });
      }
      setInput('');
    }
  };

    const editing = (id) => {
        const nameToEdit = names.find(name => name.id === id);
        if (nameToEdit) {
            setInput(nameToEdit.text);
            setEditingId(id);
        }
    };

    const handleRemove = async (id) => {
    await deleteDoc(doc(db, 'names-thursday', id));
    dispatch({ type: 'REMOVE_NAME', day: 'thursday', payload: id });
  };

    return (
        <>
        <h1>Thursday Track Training</h1>
        <ul>
            <li>Improve your speed and fitness, with our coached Thursday sessions on the Mountfield Road track behind the Lewes Leisure Centre.</li>
            <li>Sign up below as early as you can to help us plan coaching cover. If you sign up but then can't make it, please remove your name.</li>
            <li>Note: the 6pm session is a shorter version of the 7pm one and is aimed at athletes new to track sessions and those returning from injury or absence.</li>
        </ul>
       
        <div className='register'>
             <p className="signup">To sign up for a session, add your name to the list below.</p>
            <input value={input}
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Add your name"
            />
            <button className="entry" onClick={handleSubmit}>
                {editingId !== null ? 'Save' : 'Add'}
            </button>
            {editingId !== null && (
                <button onClick={() => {
                    setInput('');
                    setEditingId(null);
                }}>Cancel</button>
            )}
            <ul className="roster">
            {names.map(name => (
                <li key={name.id}>
                <span>{name.text}</span> 
                <div className='actions'>
            <button className="edit" onClick={() => editing(name.id)}>Edit</button>
            <button className="remove" onClick={() => handleRemove(name.id)}>Remove</button>
                </div>
            </li>
            ))}
            </ul>
        </div>
        </>
    )
}