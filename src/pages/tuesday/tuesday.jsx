import { useState } from 'react';
import './tuesday.css';
const sessionsData = [
  { id: 1, coach: 'Anne', distance: '5km', capacity: 12, signedUp: 0 },
  { id: 2, coach: 'Bob', distance: '8km', capacity: 12, signedUp: 0 },
  { id: 3, coach: 'Charlie', distance: '10km', capacity: 12, signedUp: 0 },
  { id: 4, coach: 'Mark', distance: '5km', capacity: 12, signedUp: 0 },
  { id: 5, coach: 'Sally', distance: '8km', capacity: 12, signedUp: 0 },
  { id: 6, coach: 'Kate', distance: '10km', capacity: 12, signedUp: 0 },
  { id: 7, coach: 'David', distance: '5km', capacity: 12, signedUp: 0 },
  { id: 8, coach: 'Fran', distance: '8km', capacity: 12, signedUp: 0 }
];



export const Tuesday = () => {
const [sessions, setSessions] = useState(sessionsData); 
const [selectedSessionId, setSelectedSessionId] = useState('');
const [runnerName, setRunnerName] = useState('');

const handleSignup = () => {
    if (!selectedSessionId || !runnerName.trim()) return;

    setSessions(prev =>
      prev.map(session =>
        session.id === parseInt(selectedSessionId) && session.signedUp < session.capacity
          ? {
              ...session,
              signedUp: session.signedUp + 1,
              runners: [...session.runners, runnerName.trim()]
            }
          : session
      )
    );

    // Clear form fields
    setRunnerName('');
    setSelectedSessionId('');
  };

    return (
        <>
        <div>
        <h1>Tuesday Training</h1>
        <h4 className="intro">To sign up for a session, click/tap on the Edit button above right</h4>
        <p>All groups will start from the <b>clubhouse</b> at the Lewes AC track at 6.30pm (except for monthly pub runs and, on the third Tuesday of the month (Apr-Aug inclusive) when we will offer several 'away from the clubhouse' starts from a clearly stated meeting point on the outskirts of town to enable more direct access to the Downs).</p>
        <ul>
            <li>Each session will last about an hour – so, in general, a longer distance means a faster pace.</li>
            <li>Groups must be no larger than 12 runners per coach/leader. Only 1 name per slot is allowed.</li>
            <li>If the group you'd like to join is already full, please add your name to the waiting-list and we'll try to accommodate you.
NB: headphones and earbuds are not allowed on club runs.</li>
        </ul>
        </div> 

        <div className="register">
            <p className="date">TUESDAY 10 JUNE</p>
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
        </div>
        </>
    )
}