import { AuthPage } from './components/AuthPage'
import { LoadingScreen } from './components/LoadingScreen'
import { RenovationWorkspace } from './components/RenovationWorkspace'
import { useAuth } from './hooks/useAuth'

export function App() {
  const { session, isLoading, isConfigured, signIn, signOut } = useAuth()

  if (isLoading) return <LoadingScreen label="Checking access…" />
  if (!session) return <AuthPage isConfigured={isConfigured} onSignIn={signIn} />

  return <RenovationWorkspace userEmail={session.user.email ?? 'Authorised user'} onSignOut={() => void signOut()} />
}
