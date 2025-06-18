import { useUser } from '../../components/UserContext';
import './home.css';

export const Home = () => {
  const { user, profile, loading } = useUser();
   if (loading) return <p>Loading...</p>;
    return (
      
    <div className="home-container">
      {/* Banner */}
      {/* <div className="banner">
        <h1 className="club-name">Lewes Running Club</h1>
        <Link to="/signout" className="signout-link">Sign Out</Link>
      </div>

      {/* Red Divider */}
      {/* <div className="red-divider"></div> */} 

      {/* Welcome Section */}
      <section className="welcome">
        <h2>Welcome, {profile?.firstName || user?.email}, to Lewes Athletics Club</h2>
        <p>Please send suggestions for improvement or requests of help to <b>runningfit@lewesac.co.uk</b></p>
        <a href="https://wiki.lewesac.co.uk/whatsapp-groups-directory" target="_blank" rel="noopener noreferrer">
          Join our WhatsApp Group
        </a>
      </section>

      {/* Subheadings */}
      <section className="sections">
        <h3>New Pages</h3>
        <h3>Race Plans</h3>
        <h3>General</h3>
        <h3>Club Training</h3>
        <h3>East Sussex Sunday Cross Country League</h3>
        <h3>Sussex Cross Country League</h3>
        <h3>Sussex Grand Prix</h3>
        <h3>West Sussex Fun Run League</h3>
        <h3>Track and Field Events</h3>
        <h3>Best Times by Club Members</h3>
        <h3>Single Event Results</h3>
        <h3>Other</h3>
      </section>
    </div>
  );
}