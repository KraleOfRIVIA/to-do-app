
"use client"

import { signIn } from "next-auth/react"
 
export default function AuthPage() {
  return (
    <>
      <button onClick={() => signIn("github", { callbackUrl: "/" })}>Sign in with GitHub</button>
      <button onClick={() => signIn("google", { callbackUrl: "/" })}>Sign in with Google</button>
    </>
  )
}
