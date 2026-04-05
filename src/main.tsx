import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Layout } from './components/Layout';
import { PATHS } from './config/paths';
import { createDynamicRouteHandleTitle } from './hooks/useTitle';
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
        path: PATHS.root.path,
        element: (
          <Navigate to={PATHS.pages.explore.path} replace={true} />
        ),
      },
      {
        path: PATHS.pages.explore.path,
        element: <ExplorePage />,
        handle: {
          title: createDynamicRouteHandleTitle('Explore'),
        },
      },
      {
        path: PATHS.pages.convert.path,
        element: <ConvertPage />,
        handle: {
          title: createDynamicRouteHandleTitle('Convert'),
        },
      },
      {
        path: PATHS.pages.about.path,
        element: <AboutPage />,
        handle: {
          title: 'About',
        },
      },
      {
        path: PATHS.pages.settings.path,
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
