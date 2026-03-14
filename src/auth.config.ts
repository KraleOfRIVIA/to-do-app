import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
  providers: [
    GitHub,
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.nickname = user.nickname ?? null;
        token.firstName = user.firstName ?? null;
        token.lastName = user.lastName ?? null;
      } else if (!token.id && token.sub) {
        token.id = token.sub;
      }

      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
        token.picture = session.user.image;
        token.nickname = session.user.nickname ?? null;
        token.firstName = session.user.firstName ?? null;
        token.lastName = session.user.lastName ?? null;
      }

      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        return session;
      }

      session.user.id = (token.id ?? token.sub ?? session.user.id) as string;
      session.user.name = token.name ?? session.user.name;
      session.user.email = token.email ?? session.user.email;
      session.user.image = (token.picture as string | null | undefined) ?? session.user.image;
      session.user.nickname = (token.nickname as string | null | undefined) ?? null;
      session.user.firstName = (token.firstName as string | null | undefined) ?? null;
      session.user.lastName = (token.lastName as string | null | undefined) ?? null;

      return session;
    },
  },
} satisfies NextAuthConfig;
