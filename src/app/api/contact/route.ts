import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.');
      return NextResponse.json({ error: 'Internal configuration error.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase.from('contact_submissions').insert({
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      phone: body.phone,
      company: body.company,
      solution: body.solution,
      scope: body.scope,
      source: 'Corporate Website Lead Form',
    });

    if (dbError) {
      throw new Error(`Failed to save submission: ${dbError.message}`);
    }

    // Best-effort notification to the automation pipeline — the submission is
    // already durably stored in Supabase, so a failure here shouldn't fail the request.
    const targetWebhook = process.env.N8N_WEBHOOK_URL;
    if (targetWebhook) {
      fetch(targetWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...body,
          timestamp: new Date().toISOString(),
          source: 'Corporate Website Lead Form',
        }),
      }).catch((err) => console.error('n8n webhook notification failed:', err));
    }

    return NextResponse.json({ success: true, message: 'Lead successfully routed.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit.' }, { status: 400 });
  }
}
