
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
import './sunday.css';

export const Sunday = () => {
    const {state, dispatch} = useContext(TrainingContext);
        const names = state.sunday;
        const [input, setInput] = useState('');
        const [editingId, setEditingId] = useState(null);
        const colRef = collection(db, 'sunday-names');
      
    useEffect(() => {
      const getMostRecentSunday = (date = new Date()) => {
 const sunday = new Date(date);
  sunday.setDate(date.getDate() - date.getDay()); // 0 = Sunday
  sunday.setHours(0, 0, 0, 0);
  return sunday;
  };

  const fetchAndMaybeReset = async () => {
    const today = new Date();
    const configDoc = doc(db, 'config', 'resetDates');
    const configSnap = await getDoc(configDoc);
    const lastResetStr = configSnap.exists() ? configSnap.data().sunday : null;

    const lastResetDate = lastResetStr ? new Date(lastResetStr) : new Date(0); // fallback to epoch if no lastReset
    const thisWeekSunday = getMostRecentSunday(today);
    thisWeekSunday.setDate(thisWeekSunday.getDate() + 1); // Shift to Monday 00:00
    thisWeekSunday.setHours(0, 0, 0, 0);


    if (lastResetDate < thisWeekSunday) {
      // Reset logic
      const snapshot = await getDocs(colRef);
      const batchDeletes = snapshot.docs.map(docItem =>
        deleteDoc(doc(db, 'sunday-names', docItem.id))
      );
      await Promise.all(batchDeletes);

      // Update reset date to today
      await setDoc(configDoc, { sunday: thisWeekSunday.toISOString() }, { merge: true });

      // Empty local list
      dispatch({ type: 'LOAD', day: 'sunday', payload: [] });
    } else {
      // Just load the list if reset not needed
      const snapshot = await getDocs(colRef);
      const loaded = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: 'LOAD', day: 'sunday', payload: loaded });
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
        await updateDoc(doc(db, 'sunday-names', editingId), { text: input });
        dispatch({ type: 'EDIT_NAME', day: 'sunday', payload: { id: editingId, text: input } });
        setEditingId(null);
      } else {
        const newDoc = await addDoc(colRef, { text: input, done: false });
        dispatch({ type: 'ADD_NAME', day: 'sunday', payload: { id: newDoc.id, text: input, done: false } });
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
            await deleteDoc(doc(db, 'sunday-names', id));
        dispatch({ type: 'REMOVE_NAME', day: 'sunday', payload: id });
  };


    return (
        <>
        <div className='sunday'>
                <h1>Sunday Trail Running</h1>
        <p>Monthly trail runs in 3 ability groups to help you achieve your goals. Different pace and distances but all with a technical focus. We will also introduce other aspects of trail running to enhance your enjoyment when out on the trails.</p>
        <h4 className="intro">To sign up for a session, add your name to the list below</h4>
        <p className="signup">Sunday 15th June @Brewcafe, Malling Community Centre.  Focus on Power walking Hills, 10k, 14k and 16k options</p>
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
        </>
    )
}