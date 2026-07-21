import { LoaderCircle } from 'lucide-react'

interface LoadingScreenProps { label: string }

export function LoadingScreen({ label }: LoadingScreenProps) {
  return <main className="grid min-h-screen place-items-center bg-paper"><div className="text-center"><LoaderCircle className="mx-auto animate-spin text-clay" size={30} /><p className="mt-4 text-sm font-semibold text-ink/60">{label}</p></div></main>
}
