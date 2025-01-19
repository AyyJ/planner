import { Box, Container } from '@mantine/core';
import { AppHeader } from './AppHeader';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <AppHeader />
      <Container size="xl">
        {children}
      </Container>
    </Box>
  );
}
