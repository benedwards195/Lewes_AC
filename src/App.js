// import logo from './logo.svg';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Layout } from './components/Layout.jsx';
import { Home } from './pages/home/Home.jsx';
import { Login } from './pages/login/login.jsx';
import { Logout } from './pages/logout/logout.jsx';
import { Monday } from './pages/monday/monday.jsx';
import { Registration } from './pages/registration/Registration.jsx';
import { Saturday } from './pages/saturday/saturday.jsx';
import { Sunday } from './pages/sunday/sunday.jsx';
import { Thursday } from './pages/thursday/thursday.jsx';
import { Tuesday } from './pages/tuesday/tuesday.jsx';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="/signout" element={<Logout />} />
      <Route path="register" element={<Registration />} />
      <Route path="monday" element={<Monday />} />
      <Route path="tuesday" element={<Tuesday />} />
      <Route path="thursday" element={<Thursday />} />
      <Route path="saturday" element={<Saturday />} />
      <Route path="sunday" element={<Sunday />} />
      </Route>
      </Routes>
  )
     

}

export default App;
