import { notifications } from '@mantine/notifications';

export function generateErrorsObject(errors) {
  alert(JSON.stringify(errors));

  if (errors === null) {
    throw Error('Connection refused');
  }

  return errors.reduce((prevObj, error) => {
    return { ...prevObj, [error.type === 'all' ? 'all' : error.path]: error.msg };
  }, {});
}

export function showNotification({ ...options }) {
  return notifications.show({
    autoClose: 3000,
    withBorder: true,
    ...options,
  });
}
