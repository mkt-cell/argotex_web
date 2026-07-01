import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const targetWebhook = process.env.N8N_WEBHOOK_URL;

    if (!targetWebhook) {
      console.error('Missing N8N_WEBHOOK_URL in environment variables.');
      return NextResponse.json({ error: 'Internal configuration error.' }, { status: 500 });
    }

    // Forward telemetry payload to n8n workflow
    const response = await fetch(targetWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        timestamp: new Date().toISOString(),
        source: 'Corporate Website Lead Form',
      }),
    });

    if (!response.ok) {
      throw new Error(`Automation pipeline responded with status: ${response.status}`);
    }

    return NextResponse.json({ success: true, message: 'Lead successfully routed.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit.' }, { status: 400 });
  }
}
