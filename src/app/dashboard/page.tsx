"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("github");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div>
      {!session ? (
        <form onSubmit={handleSignIn}>
          <button type="submit">Signin with GitHub</button>
        </form>
      ) : (
        <div>
          <p>Вы авторизованы как {session.user?.name}</p>
          <button onClick={handleSignOut}>Выйти</button>
        </div>
      )}
    </div>
  );
}