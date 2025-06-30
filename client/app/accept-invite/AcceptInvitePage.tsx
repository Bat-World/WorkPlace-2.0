"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useAcceptInvite } from "@/hooks/project/useAcceptInvitation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { user, isSignedIn } = useUser();
  const { mutate, isPending, isSuccess, error, data } = useAcceptInvite();

  useEffect(() => {
    if (token && isSignedIn && user?.id) {
      mutate({ token });
    }
  }, [token, isSignedIn, user?.id]);

  useEffect(() => {
    if (isSuccess && data?.projectId) {
      router.push(`/${data.projectId}/dashboard`);
    }
  }, [isSuccess, data, router]);

  if (!isSignedIn) return <p className="text-white">Эхлээд та нэвтрэнэ үү!</p>;
  if (isPending)
    return <p className="text-white">Урилгыг хүлээн авч байна...</p>;
  if (error)
    return (
      <p className="text-red-500">Something went wrong: {String(error)}</p>
    );

  return null;
} 