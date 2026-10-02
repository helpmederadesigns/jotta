// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

serve(async (req) => {
  try {
    // 1. Parse the incoming database webhook payload
    const payload = await req.json()
    const post = payload.record

    // 2. The Alpha Moderation Filter (We will expand this later)
    const badWords = ["nsfw", "porn", "scam", "ponzi"]
    const content = post.content.toLowerCase()
    
    // Check if any bad words exist in the text
    const isFlagged = badWords.some(word => content.includes(word))
    const newStatus = isFlagged ? 'flagged' : 'published'

    // 3. Connect to the database using the secure Service Role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 4. Update the post status
    await supabase
      .from('posts')
      .update({ status: newStatus })
      .eq('id', post.id)

    return new Response(
      JSON.stringify({ message: `Post ${post.id} updated to ${newStatus}` }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 })
  }
})