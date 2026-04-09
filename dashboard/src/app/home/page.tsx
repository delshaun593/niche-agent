import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AgentConfigPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch their agent config. 
  let { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // AUTO-ONBOARDING: If they have no agent, create Riley for them automatically!
  if (!agent) {
    const { data: newAgent, error: onboardError } = await supabase
      .from('agents')
      .insert({
        user_id: user.id,
        name: 'Riley',
        vapi_assistant_id: '575456c1-4aa7-4d74-9694-9b7dc77a6ed5',
        greeting: 'Thank you for calling Wellness Partners. This is Riley, your scheduling assistant. How may I help you today?',
        system_prompt: '# Appointment Scheduling Agent Prompt\n\nIdentity & Purpose: You are Riley, an appointment scheduling voice assistant for Wellness Partners...'
      })
      .select()
      .single()
      
    if (!onboardError) {
      agent = newAgent
    }
  }

  const defaultAgent = { 
    name: agent?.name || 'Riley', 
    greeting: agent?.greeting || 'Hello, how can I help you today?', 
    system_prompt: agent?.system_prompt || 'You are a helpful assistant.' 
  }

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-extrabold text-foreground tracking-tight">Customize Your Receptionist</h2>
        <p className="text-foreground/60 text-lg uppercase tracking-wider font-semibold">Voice Agent Configuration</p>
      </div>

      <form className="nm-flat p-10 rounded-[2.5rem] flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-foreground/70 ml-2">Agent Name</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={defaultAgent.name}
              className="nm-inset rounded-2xl border-none px-6 py-4 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all font-medium"
            />
          </div>
          
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-foreground/70 ml-2">First Greeting</label>
            <input 
              type="text" 
              name="greeting" 
              defaultValue={defaultAgent.greeting}
              className="nm-inset rounded-2xl border-none px-6 py-4 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all font-medium"
              placeholder="e.g. Hello, thanks for calling XYZ Corp."
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-foreground/70 ml-2">System Prompt (Instructions)</label>
          <textarea 
            name="system_prompt" 
            defaultValue={defaultAgent.system_prompt}
            rows={6}
            className="nm-inset rounded-[2rem] border-none px-6 py-5 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all font-medium resize-none"
            placeholder="Tell your agent how to act, what questions to ask, and how to handle objections."
          />
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="button" 
            className="nm-accent-button rounded-2xl px-10 py-4 font-bold text-lg"
          >
            Save Configuration
          </button>
        </div>
      </form>

      <div className="nm-flat p-10 rounded-[2.5rem] flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold text-foreground">Integrations</h3>
          <p className="text-foreground/50 font-medium">Connect external services to Riley&apos;s brain.</p>
        </div>
        
        <div className="flex">
          <a 
            href={`/api/google/auth?userId=${user.id}`}
            className={`
              inline-flex items-center space-x-4 px-8 py-4 rounded-2xl font-bold transition-all
              ${agent?.google_refresh_token ? 'nm-inset text-green-500' : 'nm-button text-foreground/80'}
            `}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" /></svg>
            <span>{agent?.google_refresh_token ? 'Google Calendar Connected' : 'Connect Google Calendar'}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
