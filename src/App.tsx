/**
 * Root Application Component
 *
 * Provider composition (outer → inner):
 *   LanguageProvider — i18n available to everything including AuthContext
 *   AuthProvider     — auth state, RBAC, session management
 *   RouterProvider   — routing with lazy-loaded pages
 */

import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
