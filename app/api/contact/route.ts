import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  // Simulate saving or sending an email here.
  console.log('Contact request', body);
  return NextResponse.json({ ok: true });
}
