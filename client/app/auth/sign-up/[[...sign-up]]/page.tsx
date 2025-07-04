"use client";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#EEEEEE]">
      <SignUp
        routing="hash"
        signInUrl="/auth/sign-in"
        afterSignUpUrl={"/projects"}
        forceRedirectUrl={"/projects"}
      />
    </div>
  );
};

export default SignUpPage;
