import type { Metadata } from "next";
import { Settings2, UserRound } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { PreferencesSettings } from "@/components/settings/preferences-settings";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { getSettingsProfile } from "@/lib/profile/profile-queries";

export const metadata: Metadata = {
  title: "Settings | Task Manager",
  description: "Manage your profile, language, and theme preferences",
};

export default async function SettingsPage() {
  const t = await getTranslations("SettingsPage");
  const user = await getSettingsProfile();

  if (!user) {
    redirect("/auth");
  }

  return (
    <PageContainer className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 size-36 rounded-full bg-primary/10 blur-2xl" />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {t("badge")}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("title")}</h1>
            <p className="text-sm text-muted-foreground md:text-base">{t("description")}</p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-xl border bg-background/70 px-3 py-2 text-sm">
            <Settings2 className="size-4 text-muted-foreground" />
            <span>{t("quickActions")}</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <ProfileSettingsForm
            initialProfile={{
              email: user.email,
              nickname: user.nickname,
              firstName: user.firstName,
              lastName: user.lastName,
              image: user.image,
            }}
          />
        </div>

        <div className="space-y-6">
          <PreferencesSettings />
          <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg border bg-background/70 p-2">
                <UserRound className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t("tips.title")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("tips.description")}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
