import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/config';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ message: 'Session ID is missing' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error retrieving session:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
