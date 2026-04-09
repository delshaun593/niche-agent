import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function LeadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch leads. 
  // Real app: .from('leads').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  const leads = [
    { id: 1, name: 'John Doe', phone: '+1234567890', status: 'Interested', date: '2026-04-08' },
    { id: 2, name: 'Sarah Smith', phone: '+0987654321', status: 'Follow Up', date: '2026-04-07' }
  ];

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-extrabold text-foreground tracking-tight">Captured Leads</h2>
        <p className="text-foreground/60 text-lg uppercase tracking-wider font-semibold">Leads from your AI Receptionist</p>
      </div>

      <div className="nm-flat rounded-[2.5rem] overflow-hidden border-none p-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-8 py-6 text-left text-xs font-bold text-foreground/40 uppercase tracking-[0.2em]">Name</th>
              <th className="px-8 py-6 text-left text-xs font-bold text-foreground/40 uppercase tracking-[0.2em]">Phone</th>
              <th className="px-8 py-6 text-left text-xs font-bold text-foreground/40 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-6 text-left text-xs font-bold text-foreground/40 uppercase tracking-[0.2em]">Date</th>
            </tr>
          </thead>
          <tbody className="text-foreground/80">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:nm-inset transition-all duration-300">
                <td className="px-8 py-6 whitespace-nowrap text-sm font-bold">{lead.name}</td>
                <td className="px-8 py-6 whitespace-nowrap text-sm font-medium opacity-60 font-mono">{lead.phone}</td>
                <td className="px-8 py-6 whitespace-nowrap text-sm">
                  <span className={`px-4 py-1 inline-flex text-xs leading-5 font-black uppercase tracking-wider rounded-lg ${
                    lead.status === 'Interested' ? 'nm-inset text-green-500' : 'nm-inset text-yellow-500'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-sm font-medium opacity-60">{lead.date}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center font-bold text-foreground/20 text-xl tracking-tight">
                  No leads captured yet.<br/>
                  <span className="text-sm font-medium opacity-50">Your agent is waiting for calls...</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
