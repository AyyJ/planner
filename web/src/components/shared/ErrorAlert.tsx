import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ErrorAlertProps {
  error: Error | null;
  onDismiss: () => void;
}

export const ErrorAlert = ({ error, onDismiss }: ErrorAlertProps) => {
  if (!error) return null;

  return (
    <Alert
      icon={<IconAlertCircle size="1rem" />}
      title="Error"
      color="red"
      withCloseButton
      onClose={onDismiss}
    >
      {error.message}
    </Alert>
  );
};
