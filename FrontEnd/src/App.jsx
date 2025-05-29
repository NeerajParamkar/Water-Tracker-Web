import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import AuthLayout from './layouts/AuthLayout';

import Home from './pages/Home';
import Learn from './pages/Learn';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Calculator from './pages/Calculate'; // double check this name

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes with Navbar & Footer */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="learn" element={<Learn />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="calculator" element={<Calculator />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Auth />} />
      </Route>
    </>
  )
);

export default router;
