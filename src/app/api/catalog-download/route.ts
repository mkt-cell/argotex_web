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

    // Reuses the same lead table as the main contact form — this form only
    // collects a single name field and no phone/solution/scope, so those
    // columns are left blank rather than split/guessed.
    const consented = body.consent === true;
    const { error: dbError } = await supabase.from('contact_submissions').insert({
      first_name: body.name,
      last_name: '',
      email: body.email,
      phone: '',
      company: body.company,
      solution: '',
      scope: '',
      source: 'Engineering Catalog Download',
      consent: consented,
      // Server-stamped so the PDPA audit time can't be forged by the client.
      consent_at: consented ? new Date().toISOString() : null,
    });

    if (dbError) {
      // Log the detail server-side; don't leak DB/schema internals to the client.
      console.error('Failed to save catalog-download submission:', dbError.message);
      return NextResponse.json({ error: 'Failed to submit.' }, { status: 500 });
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
          source: 'Engineering Catalog Download',
        }),
      }).catch((err) => console.error('n8n webhook notification failed:', err));
    }

    return NextResponse.json({ success: true, message: 'Lead successfully routed.' });
  } catch (error: any) {
    console.error('Catalog-download submission error:', error?.message ?? error);
    return NextResponse.json({ error: 'Failed to submit.' }, { status: 400 });
  }
}
