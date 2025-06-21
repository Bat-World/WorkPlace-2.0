import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    console.log("📨 Webhook received raw body:", rawBody);

    const body: WebhookEvent = JSON.parse(rawBody);
    console.log("🔍 Parsed webhook event type:", body.type);

    if (body.type === 'user.created') {
      const user = body.data;
      console.log("👤 Creating user:", user.id, user.email_addresses[0]?.email_address);

      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email_addresses[0]?.email_address || '',
          name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim(),
          avatarUrl: user.image_url,
        },
      });

      console.log("✅ User created successfully in DB");
    }

    if (body.type === 'user.updated') {
      const user = body.data;
      console.log("✏️ Updating user:", user.id);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          email: user.email_addresses[0]?.email_address || '',
          name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim(),
          avatarUrl: user.image_url,
        },
      });

      console.log("✅ User updated successfully in DB");
    }

    if (body.type === 'user.deleted') {
      const user = body.data;
      console.log("🗑️ Deleting user:", user.id);

      await prisma.user.delete({
        where: { id: user.id },
      });

      console.log("✅ User deleted successfully from DB");
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('❌ Webhook Error:', error);
    return new NextResponse('Webhook Error', { status: 400 });
  }
}
