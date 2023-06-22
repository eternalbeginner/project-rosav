import {
  Anchor,
  Button,
  LoadingOverlay,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useMask } from '@react-input/mask';
import { useEffect, useState } from 'react';
import { RiHashtag, RiLockLine } from 'react-icons/ri';
import { Form, Link, json, useActionData, useNavigate, useSubmit } from 'react-router-dom';

import useAuth from 'hooks/useAuth';

import { publicAx } from 'libs/axios';
import { generateErrorsObject, showNotification } from 'libs/util';

export async function action({ request }) {
  const data = await request.formData();

  try {
    const res = await publicAx.post('/auth/login', {
      regNumber: data.get('regNumber').replace(/\-/g, ''),
      password: data.get('password'),
    });

    return json({
      data: res.data.data,
      error: null,
    });
  } catch (err) {
    const receivedErrors = err.response?.data?.error ?? null;
    const errors = generateErrorsObject(receivedErrors);

    return json({
      error: errors,
    });
  }
}

export default function Login() {
  const navigate = useNavigate();
  const submitForm = useSubmit();

  const actionData = useActionData();
  const regNumberInputRef = useMask({ mask: '___-___-___', replacement: { _: /\d/ } });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { setAuth, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) navigate('/');
  }, []);

  useEffect(() => {
    if (isLoading && actionData) {
      if (actionData.error !== null) {
        setErrors(actionData.error);
        setIsLoading(false);

        showNotification({
          title: 'Oops! Something went wrong',
          message: 'Please re-fill the form and re-submit again to continue',
          color: 'red',
        });

        return;
      }

      setAuth(actionData.data);
      setIsLoading(false);

      showNotification({
        title: 'Login successfull!',
        message: 'You will be redirected in no time after this notification',
        color: 'lime',
        autoClose: 1000,
        onClose: () => navigate('/'),
      });
    }
  }, [actionData, isLoading]);

  function handleClickSubmitFormLogin() {
    setErrors({});
    setIsLoading(true);

    return submitForm();
  }

  return (
    <>
      <Stack spacing={5}>
        <Title>Sign In</Title>
        <Text>Welcome back! Glad to see you again, please fill the form below to continue.</Text>
      </Stack>
      <Form method="post">
        <Stack>
          <Stack spacing="sm" pos="relative">
            <LoadingOverlay visible={isLoading} />
            <TextInput
              label="Registration number"
              description="Unique number with length of 9 characters"
              icon={<RiHashtag />}
              error={errors.regNumber ?? null}
              name="regNumber"
              ref={regNumberInputRef}
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
            Forgot your password?{' '}
            <Anchor component={Link} href="/auth/reset-password">
              Click here
            </Anchor>
          </Text>
          <Button type="submit" onClick={handleClickSubmitFormLogin}>
            Continue
          </Button>
        </Stack>
      </Form>
    </>
  );
}
