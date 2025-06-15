import { Outlet } from 'react-router-dom';
import { Banner } from '../pages/banner/banner.jsx';
import { RedDivider } from '../pages/red-divider.jsx';
import { Navbar } from '../routes/navbar/navbar.jsx';

export function Layout() {
  return (
    <>
      <Navbar />
      <Banner />
      <RedDivider />
      <Outlet />
    </>
  );
}
