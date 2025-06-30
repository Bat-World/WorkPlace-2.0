
import { Suspense } from 'react';
import AcceptInviteClient from './_components/AcceptInvitePage';

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <AcceptInviteClient />
    </Suspense>
  );
}
