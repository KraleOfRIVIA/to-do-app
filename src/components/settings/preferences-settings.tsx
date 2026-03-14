"use client";

import { Check, Languages, Monitor, Moon, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type ComponentType, useEffect, useState, useTransition } from "react";
import { useTheme } from "next-themes";
import { localeCookieName, type AppLocale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type ThemeOption = "light" | "dark" | "system";

type OptionButtonProps = {
  active: boolean;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
};

function OptionButton({ active, icon: Icon, title, description, onClick, disabled }: OptionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
        active
          ? "border-primary/60 bg-primary/10"
          : "border-border bg-background/70 hover:bg-accent/60",
        disabled && "opacity-70"
      )}
    >
      <div className="mt-0.5 rounded-md border bg-card p-1.5">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="pr-6">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {active ? <Check className="absolute right-3 top-3 size-4 text-primary" /> : null}
    </button>
  );
}

export function PreferencesSettings() {
  const t = useTranslations("SettingsPage");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isLocalePending, startLocaleTransition] = useTransition();
  const [isThemeMounted, setIsThemeMounted] = useState(false);

  useEffect(() => {
    setIsThemeMounted(true);
  }, []);

  const activeTheme: ThemeOption = isThemeMounted ? ((theme ?? "system") as ThemeOption) : "system";

  const setLocale = (nextLocale: AppLocale) => {
    if (nextLocale === locale) {
      return;
    }

    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    startLocaleTransition(() => {
      router.refresh();
    });
  };

  const themeOptions: Array<{
    value: ThemeOption;
    icon: OptionButtonProps["icon"];
    title: string;
    description: string;
  }> = [
    {
      value: "light",
      icon: Sun,
      title: t("preferences.theme.options.light.title"),
      description: t("preferences.theme.options.light.description"),
    },
    {
      value: "dark",
      icon: Moon,
      title: t("preferences.theme.options.dark.title"),
      description: t("preferences.theme.options.dark.description"),
    },
    {
      value: "system",
      icon: Monitor,
      title: t("preferences.theme.options.system.title"),
      description: t("preferences.theme.options.system.description"),
    },
  ];

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{t("preferences.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("preferences.description")}</p>
      </div>

      <div className="mt-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Languages className="size-4 text-muted-foreground" />
            <p className="text-sm font-semibold">{t("preferences.language.title")}</p>
          </div>
          <div className="space-y-2">
            <OptionButton
              active={locale === "en"}
              icon={Languages}
              title={t("preferences.language.options.en.title")}
              description={t("preferences.language.options.en.description")}
              onClick={() => setLocale("en")}
              disabled={isLocalePending}
            />
            <OptionButton
              active={locale === "ru"}
              icon={Languages}
              title={t("preferences.language.options.ru.title")}
              description={t("preferences.language.options.ru.description")}
              onClick={() => setLocale("ru")}
              disabled={isLocalePending}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sun className="size-4 text-muted-foreground" />
            <p className="text-sm font-semibold">{t("preferences.theme.title")}</p>
          </div>
          <div className="space-y-2">
            {themeOptions.map((option) => (
              <OptionButton
                key={option.value}
                active={activeTheme === option.value}
                icon={option.icon}
                title={option.title}
                description={option.description}
                onClick={() => setTheme(option.value)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
