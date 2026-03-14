"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { getUserProfileTag } from "@/lib/cache/cache-tags";
import prisma from "@/lib/prisma";

type ActionResult = {
  ok: boolean;
  message?: string;
};

type UpdateProfileInput = {
  email: string;
  nickname?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
};

function toNullableText(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildDisplayName(input: {
  firstName: string | null;
  lastName: string | null;
  nickname: string | null;
}) {
  const fullName = [input.firstName, input.lastName].filter(Boolean).join(" ").trim();

  if (fullName) return fullName;
  if (input.nickname) return input.nickname;
  return null;
}

export async function updateProfileAction(input: UpdateProfileInput): Promise<ActionResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { ok: false, message: "Unauthorized" };
  }

  const email = input.email?.trim().toLowerCase();
  if (!email) {
    return { ok: false, message: "Email is required" };
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: "Invalid email" };
  }

  const nickname = toNullableText(input.nickname);
  const firstName = toNullableText(input.firstName);
  const lastName = toNullableText(input.lastName);
  const image = input.image?.trim();

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        nickname,
        firstName,
        lastName,
        name: buildDisplayName({
          firstName,
          lastName,
          nickname,
        }),
        ...(image ? { image } : {}),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "Email is already in use" };
    }

    console.error("Failed to update user profile:", error);
    return { ok: false, message: "Failed to update profile" };
  }

  revalidatePath("/");
  revalidatePath("/tasks");
  revalidatePath("/settings");
  revalidateTag(getUserProfileTag(userId));

  return { ok: true };
}
