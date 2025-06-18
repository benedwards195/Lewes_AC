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
    const {names, dispatch} = useContext(TrainingContext);
    // const [members, setMembers] = useState('');
    const [input, setInput] = useState('');
    const [editingId, setEditingId] = useState(null);

    const colRef = collection(db, 'names-thursday');


    useEffect(() => {
      const fetchAndMaybeReset = async () => {
        const today = new Date().toISOString().split('T')[0]; 
        const configDoc = doc(db, 'config', 'resetDates');
        const configSnap = await getDoc(configDoc);
        const lastReset = configSnap.exists() ? configSnap.data().thursday : null;
    
        if (lastReset !== today) {
          // Reset logic
          const snapshot = await getDocs(colRef);
          const batchDeletes = snapshot.docs.map(docItem => deleteDoc(doc(db, 'names-thursday', docItem.id)));
          await Promise.all(batchDeletes);
    
          // Update reset date
          await setDoc(configDoc, { thursday: today }, { merge: true });
    
          // Empty local list
          dispatch({ type: 'LOAD', payload: [] });
        } else {
          // Just load the list
          const snapshot = await getDocs(colRef);
          const loaded = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          dispatch({ type: 'LOAD', payload: loaded });
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
        dispatch({ type: 'EDIT_NAME', payload: { id: editingId, text: input } });
        setEditingId(null);
      } else {
        const newDoc = await addDoc(colRef, { text: input, done: false });
        dispatch({ type: 'ADD_NAME', payload: { id: newDoc.id, text: input, done: false } });
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
    dispatch({ type: 'REMOVE_NAME', payload: id });
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