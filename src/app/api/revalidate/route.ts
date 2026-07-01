import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { CMS_TAGS } from '@/lib/api';

const VALID_TAGS = new Set(Object.values(CMS_TAGS));

// Called by a Directus Flow whenever industries/solutions/projects (or their
// translation rows) are created, updated, or deleted, so published content
// shows up immediately instead of waiting for the hourly ISR revalidation.
export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret');
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const tag = body?.tag;

  if (typeof tag !== 'string' || !VALID_TAGS.has(tag as any)) {
    return NextResponse.json({ error: `Unknown tag: ${tag}` }, { status: 400 });
  }

  // { expire: 0 } forces immediate expiration, since this is a webhook call
  // (as opposed to `profile: 'max'`'s stale-while-revalidate behavior).
  revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: true, tag });
}
