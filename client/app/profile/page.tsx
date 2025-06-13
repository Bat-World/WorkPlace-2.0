'use client';

import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
          <div>
            <p>Name: {user.firstName} {user.lastName}</p>
            <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 