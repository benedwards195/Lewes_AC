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
import './saturday.css';

export const Saturday = () => {
     const {state, dispatch} = useContext(TrainingContext);
     const names = state.saturday;
        // const [members, setMembers] = useState('');
        const [input, setInput] = useState('');
        const [editingId, setEditingId] = useState(null);

        const colRef = collection(db, 'saturday-names');
    
       useEffect(() => {
      const getMostRecentSaturday = (date = new Date()) => {
    const day = date.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = (day - 6 + 7) % 7;  
    const saturday= new Date(date);
    saturday.setDate(date.getDate() - diff);
    saturday.setHours(0, 0, 0, 0);
    return saturday;
  };

  const fetchAndMaybeReset = async () => {
    const today = new Date();
    const configDoc = doc(db, 'config', 'resetDates');
    const configSnap = await getDoc(configDoc);
    const lastResetStr = configSnap.exists() ? configSnap.data().saturday : null;

    const lastResetDate = lastResetStr ? new Date(lastResetStr) : new Date(0); // fallback to epoch if no lastReset
    const thisWeekSaturday = getMostRecentSaturday(today);
    thisWeekSaturday.setDate(thisWeekSaturday.getDate() + 1); // Move to Sunday 00:00
    thisWeekSaturday.setHours(0, 0, 0, 0)

    if (lastResetDate < thisWeekSaturday) {
      // Reset logic
      const snapshot = await getDocs(colRef);
      const batchDeletes = snapshot.docs.map(docItem =>
        deleteDoc(doc(db, 'saturday-names', docItem.id))
      );
      await Promise.all(batchDeletes);

      // Update reset date to today
      await setDoc(configDoc, { saturday: thisWeekSaturday.toISOString() }, { merge: true });

      // Empty local list
      dispatch({ type: 'LOAD', day: 'saturday', payload: [] });
    } else {
      // Just load the list if reset not needed
      const snapshot = await getDocs(colRef);
      const loaded = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: 'LOAD', day: 'saturday', payload: loaded });
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
        await updateDoc(doc(db, 'saturday-names', editingId), { text: input });
        dispatch({ type: 'EDIT_NAME', day: 'saturday', payload: { id: editingId, text: input } });
        setEditingId(null);
      } else {
        const newDoc = await addDoc(colRef, { text: input, done: false });
        dispatch({ type: 'ADD_NAME', day: 'saturday', payload: { id: newDoc.id, text: input, done: false } });
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
            await deleteDoc(doc(db, 'saturday-names', id));
        dispatch({ type: 'REMOVE_NAME', day: 'saturday', payload: id });
  };

    return (
        <div className='saturday'>
        <h1>Saturday Training</h1>
        <h3 className="intro">To sign up for a session, add your name to the list below</h3>
        <p> <b>Improvers/Parkrun:</b> Starting at 9am and lasting approx. 1 hour, our coached improvers' sessions are designed as a friendly, fun-filled introduction to track-based training but can also suit those returning from injury or absence, or who don't yet feel ready for a Thursday-night session. Please sign up below.
    NB: on the first Saturday of each month, in place of the usual improvers' track session, Lewes AC members are encouraged instead to attend a nominated local parkrun (see the weekly calendar below for the designated venue, but no need to sign up.)</p>
        <p><b>Solo training:</b> Club runners who want to do their own track work are welcome to use the track between 9am and 2pm. Coaches will be on hand to help with advice and training assistance as needed. Please sign up below.</p>
        <p className='signup'>SIGN UP BELOW:</p>
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
        </div>
    )
}