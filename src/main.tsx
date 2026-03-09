import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Layout } from './layouts/Layout';
import { AboutPage } from './pages/AboutPage';
import { ConvertPage } from './pages/ConvertPage';
import { ExplorePage } from './pages/ExplorePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SettingsPage } from './pages/SettingsPage';
import './index.css';

const root = document.querySelector('#root');

if (!root) {
  throw new Error('No #root element found');
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    handle: {
      title: 'floats',
    },
    children: [
      {
        path: '/',
        element: <Navigate to="/explore" />,
      },
      {
        path: '/explore',
        element: <ExplorePage />,
        handle: {
          title: 'Explore',
        },
      },
      {
        path: '/convert',
        element: <ConvertPage />,
        handle: {
          title: 'Convert',
        },
      },
      {
        path: '/about',
        element: <AboutPage />,
        handle: {
          title: 'About',
        },
      },
      {
        path: '/settings',
        element: <SettingsPage />,
        handle: {
          title: 'Settings',
        },
      },
      {
        path: '*',
        element: <NotFoundPage />,
        handle: {
          title: 'Not Found',
        },
      },
    ],
  },
]);

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
