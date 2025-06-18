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
import './monday.css';

export const Monday = () => {
    const {names, dispatch} = useContext(TrainingContext);
    // const [members, setMembers] = useState('');
    const [input, setInput] = useState('');
    const [editingId, setEditingId] = useState(null);

    const colRef = collection(db, 'names-monday');

    useEffect(() => {
  const fetchAndMaybeReset = async () => {
    const today = new Date().toISOString().split('T')[0]; 
    const configDoc = doc(db, 'config', 'resetDates');
    const configSnap = await getDoc(configDoc);
    const lastReset = configSnap.exists() ? configSnap.data().monday : null;

    if (lastReset !== today) {
      // Reset logic
      const snapshot = await getDocs(colRef);
      const batchDeletes = snapshot.docs.map(docItem => deleteDoc(doc(db, 'names-monday', docItem.id)));
      await Promise.all(batchDeletes);

      // Update reset date
      await setDoc(configDoc, { monday: today }, { merge: true });

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
        await updateDoc(doc(db, 'names-monday', editingId), { text: input });
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
    await deleteDoc(doc(db, 'names-monday', id));
    dispatch({ type: 'REMOVE_NAME', payload: id });
  };

    return (
        <>
        <div>
        <h1>Monday Strength & Conditioning</h1>
        <p>Improve many of the attibutes you need to run well – strength, mobility, stabilty, coordination and resistance to injury – with our Monday evening sessions.</p>
        <p>These sessions will be held at the Leisure Centre school gym or Lewes AC's track from 6-7pm and led by qualified coaches. The sessions comprise stretching, drills, plyometrics and circuit training.</p>
        <p>All equipment is provided. Please wear regular workout clothing. </p>
        <i>If you sign up only to discover you can't attend, please remove your name as soon as possible.</i>
        <p className="signup">To sign up for a session, type your name below the list and click on the Add button</p>
        </div>
        <div className='register'>
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