import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import App from './App.tsx';
import './index.css';

const root = document.querySelector('#root');

if (!root) {
  throw new Error('No #root element found');
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
]);

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
