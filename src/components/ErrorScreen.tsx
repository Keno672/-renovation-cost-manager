import { CloudAlert } from 'lucide-react'

interface ErrorScreenProps { message: string; onSignOut: () => void }

export function ErrorScreen({ message, onSignOut }: ErrorScreenProps) {
  return <main className="grid min-h-screen place-items-center bg-paper px-5"><section className="panel max-w-md p-7 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-700"><CloudAlert size={23} /></span><h1 className="mt-5 font-display text-2xl">Couldn’t load the shared project</h1><p className="mt-2 text-sm leading-6 text-ink/55">{message}</p><div className="mt-6 flex justify-center gap-3"><button type="button" onClick={() => window.location.reload()} className="btn-primary">Try again</button><button type="button" onClick={onSignOut} className="btn-secondary">Sign out</button></div></section></main>
}
