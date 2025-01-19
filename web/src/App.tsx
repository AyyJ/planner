import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { ArtistGrid } from './components/artists/ArtistGrid';
import { AppLayout } from './components/layout/AppLayout';
import { MantineProvider } from '@mantine/core';
import { ProtectedRoute } from './components/routing/ProtectedRoute';

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{
      colorScheme: 'light',
      primaryColor: 'blue',
    }}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ArtistGrid />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;