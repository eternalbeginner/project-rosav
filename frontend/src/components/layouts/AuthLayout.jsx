import { Center, Stack } from '@mantine/core';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <Center sx={{ height: '100vh', width: '100%' }}>
      <Stack w={350}>
        <Outlet />
      </Stack>
    </Center>
  );
}
