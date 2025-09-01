"use client"

import React from "react";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react"

const providerIcons: Record<string, React.ReactNode> = {
    github: <FaGithub className="w-5 h-5 text-white" />,
    google: <FaGoogle className="w-5 h-5 text-white" />,
};

type AuthProvider = "github" | "google" | string;

interface SignInButtonProps {
    provider: AuthProvider;
    callbackUrl?: string;
    children?: React.ReactNode;
    className?: string;
}

export const SignInButton: React.FC<SignInButtonProps> = ({
    provider,
    callbackUrl = "/",
    className,
}) => (
    <button
        className={className}
        onClick={() => signIn(provider, { callbackUrl })}
        type="button"
    >
        {providerIcons[provider] && (
            <span>
                {providerIcons[provider]}
            </span>
        )}
    </button>
);

export default SignInButton;