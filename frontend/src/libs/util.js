import { notifications } from '@mantine/notifications';

export function generateErrorsObject(errors) {
  return errors.reduce((prevObj, error) => {
    return { ...prevObj, [error.path]: error.msg };
  }, {});
}

export function showNotification({ ...options }) {
  return notifications.show({
    autoClose: 3000,
    withBorder: true,
    ...options,
  });
}
