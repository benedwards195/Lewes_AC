import { Navigate } from "react-router-dom";
import { Registration } from "../pages/registration/Registration";

const DefaultRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    
    return <Navigate to="/home" replace />;
  }


  return <Registration />;
};

export default DefaultRoute;
