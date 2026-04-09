import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-72 flex flex-col nm-flat border-none m-6 rounded-[2.5rem] relative">
        <div className="p-8 flex items-center gap-4">
          <div className="nm-inset p-2 rounded-xl">
            <Image src="/logo.png" alt="NXTIER" width={32} height={32} className="rounded-md" />
          </div>
          <h1 className="text-xl font-black text-foreground tracking-tighter">NXTIER</h1>
        </div>
        
        <nav className="mt-4 px-4 flex flex-col gap-2">
          <Link href="/home" className="flex items-center px-6 py-4 rounded-2xl text-foreground/70 font-bold hover:nm-inset transition-all">
            Agent Config
          </Link>
          <Link href="/home/leads" className="flex items-center px-6 py-4 rounded-2xl text-foreground/70 font-bold hover:nm-inset transition-all">
            Captured Leads
          </Link>
        </nav>

        <div className="mt-auto p-6 m-4 nm-inset rounded-2xl">
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-1">Authenticated as</p>
          <p className="text-sm text-foreground/70 font-semibold truncate">{user.email}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
