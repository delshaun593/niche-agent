import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Niche Agent</h1>
        </div>
        <nav className="mt-6">
          <Link href="/home" className="block px-6 py-3 text-gray-600 hover:bg-gray-100 font-medium">
            Agent Config
          </Link>
          <Link href="/home/leads" className="block px-6 py-3 text-gray-600 hover:bg-gray-100 font-medium">
            Captured Leads
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white">
        {children}
      </main>
    </div>
  )
}
