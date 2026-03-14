import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { auth } from "@/auth";
import { getUserProfileTag } from "@/lib/cache/cache-tags";
import prisma from "@/lib/prisma";

type SettingsProfileRecord = {
  email: string;
  nickname: string | null;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
};

export type SettingsProfile = {
  email: string;
  nickname: string;
  firstName: string;
  lastName: string;
  image: string | null;
};

const PROFILE_REVALIDATE_SECONDS = 300;

async function fetchProfileFromDatabase(userId: string): Promise<SettingsProfileRecord | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      nickname: true,
      firstName: true,
      lastName: true,
      image: true,
    },
  });
}

async function getCachedProfile(userId: string): Promise<SettingsProfileRecord | null> {
  const loadProfile = unstable_cache(
    async () => fetchProfileFromDatabase(userId),
    [`settings-profile:${userId}`],
    {
      tags: [getUserProfileTag(userId)],
      revalidate: PROFILE_REVALIDATE_SECONDS,
    }
  );

  return loadProfile();
}

export const getSettingsProfile = cache(async (): Promise<SettingsProfile | null> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const profile = await getCachedProfile(userId);
  if (!profile) {
    return null;
  }

  return {
    email: profile.email,
    nickname: profile.nickname ?? "",
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    image: profile.image,
  };
});
