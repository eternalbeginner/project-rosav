import { Anchor, Button, LoadingOverlay, Stack, Text, TextInput, Title } from '@mantine/core';
import { useMask } from '@react-input/mask';
import { useState } from 'react';
import { RiHashtag } from 'react-icons/ri';
import { Form, Link } from 'react-router-dom';

export async function loader({ request }) {
  console.log('auth loader', request);
  return JSON.stringify({ ok: true });
}

export default function ResetPassword() {
  const regNumberInputRef = useMask({ mask: '___-___-___', replacement: { _: /\d/ } });

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Stack spacing={5}>
        <Title>Reset Password</Title>
        <Text>Oh no! It seems like you forgot your own password, its okay lets change it.</Text>
      </Stack>
      <Form method="post">
        <Stack>
          <Stack spacing="sm" pos="relative">
            <LoadingOverlay visible={isLoading} />
            <TextInput
              label="Registration number"
              description="Unique number with length of 9 characters"
              icon={<RiHashtag />}
              name="regNumber"
              ref={regNumberInputRef}
              required
            />
          </Stack>
          <Text color="dimmed" size="sm">
            I think I remember it!{' '}
            <Anchor component={Link} to="/auth/login">
              Bring me back
            </Anchor>
          </Text>
          <Button type="submit" onClick={() => {}}>
            Continue
          </Button>
        </Stack>
      </Form>
    </>
  );
}
