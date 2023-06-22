import { Box } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

export default function Root() {
  const { auth } = useAuth();

  return (
    <Box sx={() => ({ height: '100%', minHeight: '100vh', width: '100%' })}>
      <span>{auth().id}</span>
      <Outlet />
    </Box>
  );
}
