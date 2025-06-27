"use client";

import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-[#EEEEEE]">
            <SignIn
                routing="hash"
                signUpUrl="/auth/sign-up"
                afterSignUpUrl={"/projects"}
                forceRedirectUrl={"/projects"}
            />
        </div>
    );
};

export default SignInPage;