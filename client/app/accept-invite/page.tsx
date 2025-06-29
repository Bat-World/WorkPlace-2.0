import { Suspense } from "react";
import AcceptInvitePage from "./AcceptInvitePage";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-white">Loading...</p>}>
      <AcceptInvitePage />
    </Suspense>
  );
}
