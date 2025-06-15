import { Link } from "react-router-dom"
import './banner.css'

export const Banner = () => {
    return (
    <>
      {/* Banner */}
      <div className="banner">
        <h1 className="club-name">Lewes Athletics Club</h1>
        <Link to="/signout" className="signout-link">Sign Out</Link>
      </div>
      </>
      
      )
}