import { Route, Routes } from 'react-router-dom';
import './App.css';
import DefaultRoute from './components/DefaultRoute.jsx';
import { Layout } from './components/Layout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { UserProvider } from './components/UserContext.jsx';
import { Home } from './pages/home/Home.jsx';
import { Login } from './pages/login/Login.jsx';
import { Logout } from './pages/logout/logout.jsx';
import { Monday } from './pages/monday/monday.jsx';
import { Registration } from './pages/registration/Registration.jsx';
import { Saturday } from './pages/saturday/saturday.jsx';
import { Sunday } from './pages/sunday/sunday.jsx';
import { Thursday } from './pages/thursday/thursday.jsx';
import { Tuesday } from './pages/tuesday/tuesday.jsx';


function App() {
  return (
    <UserProvider>
    <Routes>
      <Route path='/' element={<Layout />}>
      <Route index element={<DefaultRoute />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Registration />} />
      <Route path="signout" element={<Logout />} />
      
     <Route
            path="home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="monday"
            element={
              <PrivateRoute>
                <Monday />
              </PrivateRoute>
            }
          />
          <Route
            path="tuesday"
            element={
              <PrivateRoute>
                <Tuesday />
              </PrivateRoute>
            }
          />
          <Route
            path="thursday"
            element={
              <PrivateRoute>
                <Thursday />
              </PrivateRoute>
            }
          />
          <Route
            path="saturday"
            element={
              <PrivateRoute>
                <Saturday />
              </PrivateRoute>
            }
          />
          <Route
            path="sunday"
            element={
              <PrivateRoute>
                <Sunday />
              </PrivateRoute>
            }
          />
          
        </Route>
      </Routes>
    </UserProvider>
  )
     

}

export default App;
