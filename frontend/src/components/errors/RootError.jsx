import { useTheme } from '@emotion/react';
import { Anchor, Center, Stack, Text, Title } from '@mantine/core';
import { RiAlertLine } from 'react-icons/ri';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';

export default function RootError() {
  const navigate = useNavigate();
  const error = useRouteError();
  const theme = useTheme();

  if (isRouteErrorResponse(error)) {
    let errorMessage;

    switch (error.status) {
      case 404:
        errorMessage =
          'The page you are trying to access is not found. Please contact the administrator for more information!';
        break;
      default:
        errorMessage =
          'Something went wrong, please contact the administrator for more information!';
        break;
    }

    return (
      <Center w="100%" h="100vh">
        <Stack w="50%">
          <Center>
            <RiAlertLine color={theme.colors.red[6]} size={75} />
          </Center>
          <Title align="center">Oopsie Whoopsie!</Title>
          <Text align="center" color="dimmed">
            {errorMessage}{' '}
            <Anchor align="center" onClick={() => navigate(-1)}>
              Bring me back
            </Anchor>
          </Text>
        </Stack>
      </Center>
    );
  }
}
