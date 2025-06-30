import { Suspense } from "react";
import AcceptInvitePage from "./AcceptInvitePage";

<<<<<<< HEAD
export default function Page() {
  return (
    <Suspense fallback={<p className="text-white">Loading...</p>}>
      <AcceptInvitePage />
    </Suspense>
=======
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAcceptInvite } from '@/hooks/project/useAcceptInvitation';
import { useInvitationDetails } from '@/hooks/project/useInvitationDetails';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-toastify';

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { user, isSignedIn, isLoaded } = useUser();

  
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      const returnTo = `/accept-invite?token=${token}`;
      router.push(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`);
    }
  }, [isLoaded, isSignedIn, token, router]);

  const {
    data: invitation,
    isLoading,
    error,
  } = useInvitationDetails(token);
  const {
    mutate,
    isPending: isAccepting,
    isSuccess,
    data: acceptData,
    error: acceptError,
  } = useAcceptInvite();

  const handleAccept = () => {
    if (token) mutate({ token });
  };

  useEffect(() => {
    if (isSuccess && acceptData?.projectId) {
      toast.success(acceptData.message);
      router.push(`/${acceptData.projectId}/dashboard`);
    }
  }, [isSuccess, acceptData, router]);

  if (!isLoaded || !isSignedIn) return null; 
  if (isLoading) return <p className="text-white">Loading invitation details...</p>;
  if (error) return <p className="text-red-500">Invalid or expired invitation.</p>;
  if (acceptError) return <p className="text-red-500">Something went wrong: {String(acceptError)}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-bold mb-4">You're invited to join a project!</h1>
      <p className="mb-2"><strong>Project:</strong> {invitation?.projectTitle}</p>
      <p className="mb-4"><strong>Invited by:</strong> {invitation?.invitedByEmail}</p>

      <button
        onClick={handleAccept}
        disabled={isAccepting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isAccepting ? 'Accepting...' : 'Accept Invitation'}
      </button>
    </div>
>>>>>>> main
  );
}
