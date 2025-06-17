import { prisma } from '@/lib/prisma';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  const rawBody = await req.text();
  const body: WebhookEvent = JSON.parse(rawBody);

  if (body.type === 'user.created') {
    const user = body.data;

    try {

      await prisma.user.create({
        data: {
          id: user.id, 
          email: user.email_addresses[0]?.email_address || '',
          name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim(),
          image: user.image_url,
        },
      });

    } catch (error) {
    }
  }

  if (body.type === 'user.deleted') {
  const user = body.data;
  try {
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  } catch (error) {
  }
}


  return NextResponse.json({ status: 'ok' });
}
