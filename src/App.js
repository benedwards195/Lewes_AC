// import logo from './logo.svg';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import DefaultRoute from './components/DefaultRoute.jsx';
import { Layout } from './components/Layout.jsx';
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
      <Route path="home" element={<Home />} />
      <Route path="/signout" element={<Logout />} />
      <Route path="register" element={<Registration />} />
      <Route path="monday" element={<Monday />} />
      <Route path="tuesday" element={<Tuesday />} />
      <Route path="thursday" element={<Thursday />} />
      <Route path="saturday" element={<Saturday />} />
      <Route path="sunday" element={<Sunday />} />
      </Route>
      </Routes>
      </UserProvider>
  )
     

}

export default App;
