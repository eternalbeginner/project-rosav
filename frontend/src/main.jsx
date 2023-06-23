import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from 'routes/root';
import Login, { action as loginAction } from 'routes/auth/login';
import ResetPassword, { loader as resetPasswordLoader } from 'routes/auth/reset-password';

import AuthLayout from 'components/layouts/AuthLayout';
import RootError from 'components/errors/RootError';

import AuthProvider from 'providers/AuthProvider';

const root = createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <RootError />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', action: loginAction, element: <Login /> },
      { path: 'reset-password', loader: resetPasswordLoader, element: <ResetPassword /> },
    ],
  },
]);

root.render(
  <StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ModalsProvider>
        <AuthProvider>
          <Notifications />
          <RouterProvider router={router} />
        </AuthProvider>
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>,
);
