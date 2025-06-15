
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc
} from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { TrainingContext } from '../../components/TrainingContext';
import { db } from '../../firebase';
import './sunday.css';

export const Sunday = () => {
    const {names, dispatch} = useContext(TrainingContext);
        // const [members, setMembers] = useState('');
        const [input, setInput] = useState('');
        const [editingId, setEditingId] = useState(null);

        const colRef = collection(db, 'sunday-names');
    
        useEffect(() => {
        const fetchNames = async () => {
      const snapshot = await getDocs(colRef);
      const loaded = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      dispatch({ type: 'LOAD', payload: loaded });
    };

    fetchNames();
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
            await deleteDoc(doc(db, 'sunday-names', id));
        dispatch({ type: 'REMOVE_NAME', payload: id });
  };


    return (
        <>
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
        </>
    )
}