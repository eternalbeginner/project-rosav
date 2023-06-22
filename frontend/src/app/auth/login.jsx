import { Anchor, Box, Button, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { RiHashtag, RiLockLine } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';

import useAuth from 'hooks/useAuth';

import { publicAx } from 'libs/axios';

export default function Login() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const { setAuth, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, []);

  async function handleSubmitFormLogin(evt) {
    evt.preventDefault();
    setErrors({});

    try {
      const res = await publicAx.post('/auth/login', {
        regNumber: evt.target.regNumber.value,
        password: evt.target.password.value,
      });

      setAuth(res.data.data);

      return notifications.show({
        title: 'Login successfull!',
        message: 'You will be redirected in no time after this notification',
        color: 'lime',
        onClose: () => {
          return navigate('/');
        },
      });
    } catch (err) {
      const receivedErrors = err.response?.data?.error ?? null;

      if (receivedErrors !== null) {
        receivedErrors.forEach((error) => {
          setErrors((prevError) => ({ ...prevError, [error.path]: error.msg }));
        });
      }

      return notifications.show({
        title: 'Oops! Something went wrong',
        message: 'Please re-fill the form and re-submit again to continue',
        color: 'red',
        autoClose: 3000,
        withBorder: true,
      });
    }
  }

  return (
    <>
      <Box>
        <Title>Sign In</Title>
        <Text>Welcome back! Glad to see you again, please fill the form below to continue.</Text>
      </Box>
      <form onSubmit={handleSubmitFormLogin}>
        <Stack>
          <Stack spacing="sm">
            <TextInput
              label="Registration number"
              description="Unique number with length of 9 characters"
              icon={<RiHashtag />}
              error={errors.regNumber ?? null}
              name="regNumber"
              required
            />
            <PasswordInput
              label="Password"
              icon={<RiLockLine />}
              name="password"
              error={errors.password ?? null}
              required
            />
          </Stack>
          <Text color="dimmed" size="sm">
            Do not have an account yet?{' '}
            <Anchor component={Link} href="/auth/register">
              Register here
            </Anchor>
          </Text>
          <Button type="submit">Continue</Button>
        </Stack>
      </form>
    </>
  );
}
