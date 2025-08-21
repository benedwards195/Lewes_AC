import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import './tuesday.css';


const sessionsData = [
  { id: 1, coach: 'Anne', distance: '5km', capacity: 12, signedUp: 0, runners: [] },
  { id: 2, coach: 'Bob', distance: '8km', capacity: 12, signedUp: 0, runners: [] },
  { id: 3, coach: 'Charlie', distance: '10km', capacity: 12, signedUp: 0, runners: [] },
  { id: 4, coach: 'Mark', distance: '5km', capacity: 12, signedUp: 0, runners: []},
  { id: 5, coach: 'Sally', distance: '8km', capacity: 12, signedUp: 0, runners: [] },
  { id: 6, coach: 'Kate', distance: '10km', capacity: 12, signedUp: 0, runners: [] },
  { id: 7, coach: 'David', distance: '5km', capacity: 12, signedUp: 0, runners: [] },
  { id: 8, coach: 'Fran', distance: '8km', capacity: 12, signedUp: 0, runners: [] }
];


const getMostRecentTuesday = (date = new Date()) => {
  const tuesday = new Date(date);
  const day = tuesday.getDay();
  const diff = (day >= 2) ? day - 2 : day + 5; // days to subtract
  tuesday.setDate(tuesday.getDate() - diff);
  tuesday.setHours(0, 0, 0, 0);
  return tuesday;
};

export const Tuesday = () => {
const [sessions, setSessions] = useState(sessionsData); 
const [selectedSessionId, setSelectedSessionId] = useState('');
const [runnerName, setRunnerName] = useState('');
const [confirmation, setConfirmation] = useState('');

const tuesdaySignupsRef = collection(db, 'tuesday-signups');

useEffect(() => {
  
    const loadSignups = async () => {
      try {
        const lastResetStr = localStorage.getItem('tuesdayLastReset');
        const lastReset = lastResetStr ? new Date(lastResetStr) : null;
        const recentTuesday = getMostRecentTuesday();

        if (!lastReset || lastReset < recentTuesday) {
          // Resets signups if last reset is before recent Tuesday

          // Deletes all signups in Firestore
          const signupsSnapshot = await getDocs(tuesdaySignupsRef);
          const batchDeletes = signupsSnapshot.docs.map((docSnap) => deleteDoc(doc(db, 'tuesday-signups', docSnap.id)));
          await Promise.all(batchDeletes);

          // Resets local storage date
          localStorage.setItem('tuesdayLastReset', new Date().toISOString());

          // Resets sessions state to initial (no runners)
          setSessions(sessionsData);
          return;
          
        }

       
        const signupsSnapshot = await getDocs(tuesdaySignupsRef);

        // Builds map from sessionId to runners
        const sessionMap = sessionsData.map(session => ({
          ...session,
          runners: [],
          signedUp: 0
        }));

        signupsSnapshot.forEach(docSnap => {
          const data = docSnap.data();
          const session = sessionMap.find(s => s.id === data.sessionId);
          if (session) {
            session.runners.push(data.name);
            session.signedUp++;
          }
        });

        setSessions(sessionMap);
      } catch (error) {
        console.error('Error loading Tuesday signups:', error);
      }
    };

    loadSignups();
    
  }, []);

const handleSignup = async () => {
  if (!selectedSessionId || !runnerName.trim()) return;

  const selectedSession = sessions.find(
    (session) => session.id === parseInt(selectedSessionId)
  );

  if (selectedSession && selectedSession.signedUp < selectedSession.capacity) {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === selectedSession.id
          ? {
              ...session,
              signedUp: session.signedUp + 1,
              runners: [...session.runners, runnerName.trim()]
            }
          : session
      )
    );

    setConfirmation(`Congratulations, you are successfully registered with ${selectedSession.coach}.`);

    // Posts to Firestore
    try {
      await addDoc(tuesdaySignupsRef, {
        name: runnerName.trim(),
        nameKey: runnerName.trim().toLowerCase(),
        sessionId: selectedSession.id,
        coach: selectedSession.coach,
        distance: selectedSession.distance,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving signup to Firestore:', error);
    }
  }

  setRunnerName('');
  setSelectedSessionId('');
  console.log('Signing up:', runnerName.trim(), 'to session', selectedSessionId);

};

const handleRemove = async (runnerNameToRemove, sessionId) => {
  if (!runnerNameToRemove) {
    alert("Runner name is required.");
    return;
  }

  const runnerKey = runnerNameToRemove.trim().toLowerCase();

  // Query signups for the given session
  const q = query(
  tuesdaySignupsRef, 
  where('sessionId', '==', sessionId), 
  where('nameKey', '==', runnerKey)
);
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
  alert("You don't seem to be signed up for this session.");
  return;
}

const docToDelete = snapshot.docs[0];


  try {
    await deleteDoc(doc(db, "tuesday-signups", docToDelete.id));
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { 
              ...session, 
              runners: session.runners.filter((r) => r !== docToDelete.data().name),
              signedUp: session.signedUp - 1
            }
          : session
      )
    );
    setConfirmation('You have been removed from the session.');
    setRunnerName('');
  } catch (error) {
    console.error("Error removing document:", error);
  }
  console.log('Removing:', runnerNameToRemove, 'from session', sessionId);
};

const getNextTuesday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
  const daysUntilTuesday = (9 - dayOfWeek) % 7 || 7;
  const nextTuesday = new Date(today);
  nextTuesday.setDate(today.getDate() + daysUntilTuesday);
  return nextTuesday;
}

const nextTuesday = getNextTuesday();


    return (
        <>
        <div className="Tuesday">
        <h1>Tuesday Training</h1>
        <h4 className="intro">To sign up for a session, add your name to the list below. If you can no longer make it, click remove next to your name. </h4>
        <p>All groups will start from the <b>clubhouse</b> at the Lewes AC track at 6.30pm (except for monthly pub runs and, on the third Tuesday of the month (Apr-Aug inclusive) when we will offer several 'away from the clubhouse' starts from a clearly stated meeting point on the outskirts of town to enable more direct access to the Downs).</p>
        <ul>
            <li>Each session will last about an hour – so, in general, a longer distance means a faster pace.</li>
            <li>Groups must be no larger than 12 runners per coach/leader. Only 1 name per slot is allowed.</li>
            <li>If the group you'd like to join is already full, please add your name to the waiting-list and we'll try to accommodate you.
NB: headphones and earbuds are not allowed on club runs.</li>
        </ul>
        </div> 

        <div className="register">
            <p className="date">{nextTuesday.toDateString()}</p>
            <p>All groups will be starting at 6.30pm from the Clubhouse at the track (except for the Post-Beginners Progression Course)</p>
            <p>When signing up please include your surname</p>

             <label htmlFor="runnerName">Your Name:</label>
             <input
              id="runnerName"
              type="text"
              placeholder="e.g. Jane Smith"
              value={runnerName}
              onChange={(e) => setRunnerName(e.target.value)}
            />

            <label htmlFor="sessionSelect">Choose your session:</label>
        <select
          id="sessionSelect"
          value={selectedSessionId}
          onChange={(e) => setSelectedSessionId(e.target.value)}
        >
          <option value="">-- Select a session --</option>
          {sessions.map(({ id, coach, distance, capacity, signedUp }) => (
            <option key={id} value={id} disabled={signedUp >= capacity}>
              Coach: {coach}, Distance: {distance}, Spaces Left: {capacity - signedUp}
            </option>
          ))}
        </select>

        <button onClick={handleSignup} disabled={!selectedSessionId}>
          Sign Up
        </button>
        {confirmation && <p className="confirmation">{confirmation}</p>}

        </div>
        <div className="register">
  <h2>Current Signups</h2>
  {sessions.map(({ id, coach, distance, runners }) => (
    <div
      key={id}
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem',
        backgroundColor: '#f9f9f9'
      }}
    >
      <h4 style={{ marginBottom: '0.5rem' }}>
        Coach: {coach} <span style={{ fontWeight: 'normal' }}>({distance})</span>
      </h4>
      {runners.length > 0 ? (
      <ul style={{ marginLeft: '1rem' }}>
  {runners.map((runner, index) => (
  <li key={index}>
    {runner}
  
    <button
  style={{ marginLeft: '0.5rem', padding: '0.2rem 0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}
  onClick={() => handleRemove(runner, id)}  
>
  Remove
</button>
  </li>
  ))}
</ul>

      ) : (
        <p style={{ fontStyle: 'italic', color: '#555' }}>No runners signed up yet.</p>
      )}
    </div>
  ))}
</div>

        </>
    )
}