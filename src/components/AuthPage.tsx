import { useState, type FormEvent } from 'react'
import { BarChart3, KeyRound, LoaderCircle, LockKeyhole } from 'lucide-react'

interface AuthPageProps {
  isConfigured: boolean
  onSignIn: (email: string, password: string) => Promise<string | null>
}

export function AuthPage({ isConfigured, onSignIn }: AuthPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (event: FormEvent): Promise<void> => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    const message = await onSignIn(email.trim(), password)
    if (message) setError(message)
    setIsSubmitting(false)
  }

  return (
    <main className="grid min-h-screen bg-paper lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-evergreen p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -right-32 -top-28 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -right-16 -top-12 h-72 w-72 rounded-full border border-white/10" />
        <div className="relative flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-clay"><BarChart3 size={22} /></span><div><p className="font-display text-xl leading-none">Renovation</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.19em] text-white/45">Ledger</p></div></div>
        <div className="relative my-auto max-w-lg"><p className="text-xs font-bold uppercase tracking-[.2em] text-white/45">One shared project</p><h1 className="mt-4 font-display text-5xl leading-[1.08]">The latest costs, wherever the work takes you.</h1><p className="mt-6 text-base leading-7 text-white/60">Sign in to view and update the same renovation schedule from your phone, laptop or tablet.</p></div>
        <p className="relative flex items-center gap-2 text-xs text-white/40"><LockKeyhole size={15} />Protected by Supabase authentication</p>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden"><span className="grid h-11 w-11 place-items-center rounded-xl bg-evergreen text-white"><BarChart3 size={22} /></span><div><p className="font-display text-xl leading-none">Renovation Ledger</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.16em] text-ink/40">Shared project</p></div></div>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-clay/10 text-clay"><KeyRound size={22} /></span>
          <h1 className="mt-5 font-display text-4xl">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-ink/55">Use an account created by the project owner to access the shared renovation ledger.</p>

          {!isConfigured ? (
            <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5"><h2 className="font-bold text-amber-900">Supabase setup required</h2><p className="mt-2 text-sm leading-6 text-amber-800">Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to a <code>.env.local</code> file, then restart the app.</p></div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-5">
              <label><span className="label">Email address</span><input className="field" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
              <label><span className="label">Password</span><input className="field" type="password" autoComplete="current-password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" /></label>
              {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700" role="alert">{error}</p>}
              <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="animate-spin" size={18} />Signing in…</> : 'Sign in'}</button>
            </form>
          )}
          <p className="mt-6 text-center text-xs leading-5 text-ink/40">Need access? Ask the project owner to create an account for you.</p>
        </div>
      </section>
    </main>
  )
}
