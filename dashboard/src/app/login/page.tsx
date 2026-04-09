import { login, signup } from './actions'
import Image from 'next/image'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message: string }> }) {
  const { message } = await searchParams;
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-6 mt-20 mx-auto">
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="nm-flat p-4 rounded-2xl w-24 h-24 flex items-center justify-center">
          <Image 
            src="/logo.png" 
            alt="NXTIER Logo" 
            width={64} 
            height={64}
            className="rounded-lg"
          />
        </div>
        <h1 className="text-3xl font-bold text-foreground">NXTIER</h1>
      </div>

      <form className="nm-flat p-10 rounded-3xl flex flex-col w-full gap-6 text-foreground">
        <h2 className="text-xl font-medium mb-2 text-center">Welcome Back</h2>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium opacity-70" htmlFor="email">
            Email Address
          </label>
          <input
            className="nm-inset rounded-xl px-4 py-3 border-none outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            name="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium opacity-70" htmlFor="password">
            Password
          </label>
          <input
            className="nm-inset rounded-xl px-4 py-3 border-none outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button
            formAction={login}
            className="nm-accent-button rounded-xl px-4 py-3 font-semibold text-lg"
          >
            Sign In
          </button>
          
          <div className="flex items-center gap-4 my-2">
            <div className="h-px bg-foreground/10 flex-1"></div>
            <span className="text-xs opacity-50 uppercase tracking-widest font-bold">or</span>
            <div className="h-px bg-foreground/10 flex-1"></div>
          </div>

          <button
            formAction={signup}
            className="nm-button rounded-xl px-4 py-3 font-medium opacity-80 hover:opacity-100"
          >
            Create Account
          </button>
        </div>

        {message && (
          <div className="mt-4 p-4 nm-inset rounded-xl text-center text-sm text-red-500 font-medium">
            {message}
          </div>
        )}
      </form>
    </div>
  )
}
