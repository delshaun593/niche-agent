import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AgentConfigPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch their agent config. 
  // In a real app, you'd query Supabase: .from('agents').select('*').eq('user_id', user.id)
  const agent = { name: 'Sarah', greeting: 'Hello, how can I help you today?', system_prompt: 'You are a helpful assistant.' };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Customize Your Receptionist</h2>
      <p className="text-gray-600 mb-8">Adjust the behavior and personality of your AI phone agent.</p>

      <form className="space-y-6 bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
          <input 
            type="text" 
            name="name" 
            defaultValue={agent.name}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Greeting</label>
          <input 
            type="text" 
            name="greeting" 
            defaultValue={agent.greeting}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. Hello, thanks for calling XYZ Corp. How can I help?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">System Prompt (Instructions)</label>
          <textarea 
            name="system_prompt" 
            defaultValue={agent.system_prompt}
            rows={5}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Tell your agent how to act, what questions to ask, and how to handle objections."
          />
        </div>

        <button 
          type="button" 
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium transition"
        >
          Save Configuration
        </button>
      </form>

      <div className="mt-8 bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-2 text-gray-900">Integrations</h3>
        <p className="text-gray-600 mb-4">Connect external services to your AI agent.</p>
        <a 
          href={`http://localhost:8080/api/google/auth?userId=${user.id}`}
          className="inline-flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" /></svg>
          <span>Connect Google Calendar</span>
        </a>
      </div>
    </div>
  )
}
