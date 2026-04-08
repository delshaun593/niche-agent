'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveAgentConfig(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Not authenticated')
  }

  const name = formData.get('name') as string
  const greeting = formData.get('greeting') as string
  const systemPrompt = formData.get('system_prompt') as string
  const vapiAssistantId = formData.get('assistant_id') as string // User would need to input this, or we retrieve it

  // Update or Insert the agent configuration
  const { error } = await supabase
    .from('agents')
    .upsert({
      user_id: user.id,
      name,
      greeting,
      system_prompt: systemPrompt,
      updated_at: new Date().toISOString()
      // Note: mapping `vapi_assistant_id` should ideally just happen once when they link Vapi.
    }, { onConflict: 'user_id' })

  if (error) {
    console.error('Error saving config', error)
    throw new Error('Failed to save configuration')
  }

  revalidatePath('/home')
  
  // TO-DO: Optional - use the Vapi REST API here to patch the real Assistant on Vapi
  // fetch(`https://api.vapi.ai/assistant/${vapiAssistantId}`, {
  //   method: 'PATCH',
  //   headers: { Authorization: `Bearer ${process.env.VAPI_PRIVATE_API_KEY}` },
  //   body: JSON.stringify({ model: { messages: [{ role: 'system', content: systemPrompt }] } })
  // })
}
