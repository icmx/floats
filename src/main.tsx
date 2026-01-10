import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Layout } from './layouts/Layout';
import { ChartPage } from './pages/ChartPage';
import { ConvertPage } from './pages/ConvertPage';
import { DataPage } from './pages/DataPage';
import { HomePage } from './pages/HomePage';
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
        element: <HomePage />,
      },
      {
        path: '/chart',
        element: <ChartPage />,
        handle: {
          title: 'Chart',
        },
      },
      {
        path: '/data',
        element: <DataPage />,
        handle: {
          title: 'Data',
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
