"use client";

import { Save, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { toast } from "sonner";
import { updateProfileAction } from "@/app/(app)/actions/profile-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/lib/uploads/upload-image";

type ProfileFormData = {
  email: string;
  nickname: string;
  firstName: string;
  lastName: string;
  image: string | null;
};

type ProfileSettingsFormProps = {
  initialProfile: ProfileFormData;
};

const CANVAS_OUTPUT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getAvatarFallback(profile: ProfileFormData) {
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
  if (fullName) {
    return fullName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  if (profile.nickname) {
    return profile.nickname.slice(0, 2).toUpperCase();
  }

  if (profile.email) {
    return profile.email.slice(0, 2).toUpperCase();
  }

  return "U";
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load selected image"));
    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, 0.92);
  });
}

function getExtensionForMimeType(mimeType: string) {
  if (mimeType === "image/jpeg") {
    return ".jpg";
  }

  if (mimeType === "image/webp") {
    return ".webp";
  }

  return ".png";
}

async function createCroppedAvatarFile(params: {
  imageSrc: string;
  croppedAreaPixels: Area;
  fileName: string;
  mimeType: string;
}) {
  const { imageSrc, croppedAreaPixels, fileName, mimeType } = params;
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const cropSize = Math.max(1, Math.floor(Math.max(croppedAreaPixels.width, croppedAreaPixels.height)));

  canvas.width = cropSize;
  canvas.height = cropSize;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Failed to initialize crop canvas");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    cropSize,
    cropSize
  );

  const outputType = CANVAS_OUTPUT_TYPES.has(mimeType) ? mimeType : "image/png";
  const blob = (await canvasToBlob(canvas, outputType)) ?? (await canvasToBlob(canvas, "image/png"));
  if (!blob) {
    throw new Error("Failed to create cropped avatar");
  }

  const baseFileName = fileName.replace(/\.[^/.]+$/, "").trim() || "avatar";
  const extension = getExtensionForMimeType(blob.type || outputType);
  return new File([blob], `${baseFileName}-avatar${extension}`, { type: blob.type || outputType });
}

export function ProfileSettingsForm({ initialProfile }: ProfileSettingsFormProps) {
  const t = useTranslations("SettingsPage");
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [isPending, startTransition] = useTransition();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(initialProfile.image);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [isApplyingCrop, setIsApplyingCrop] = useState(false);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [pendingAvatarMeta, setPendingAvatarMeta] = useState<{ fileName: string; mimeType: string } | null>(null);
  const avatarPreviewUrlRef = useRef<string | null>(null);
  const cropSourceUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrlRef.current) {
        URL.revokeObjectURL(avatarPreviewUrlRef.current);
      }

      if (cropSourceUrlRef.current) {
        URL.revokeObjectURL(cropSourceUrlRef.current);
      }
    };
  }, []);

  const resetCropDialog = () => {
    if (cropSourceUrlRef.current) {
      URL.revokeObjectURL(cropSourceUrlRef.current);
      cropSourceUrlRef.current = null;
    }

    setCropSource(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setPendingAvatarMeta(null);
    setIsApplyingCrop(false);
  };

  const closeCropDialog = () => {
    resetCropDialog();
    setIsCropDialogOpen(false);
  };

  const handleCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    cropSourceUrlRef.current = objectUrl;
    setCropSource(objectUrl);
    setPendingAvatarMeta({ fileName: file.name, mimeType: file.type });
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setIsCropDialogOpen(true);
  };

  const handleApplyCrop = async () => {
    if (!cropSource || !croppedAreaPixels || !pendingAvatarMeta) {
      return;
    }

    setIsApplyingCrop(true);

    try {
      const nextAvatarFile = await createCroppedAvatarFile({
        imageSrc: cropSource,
        croppedAreaPixels,
        fileName: pendingAvatarMeta.fileName,
        mimeType: pendingAvatarMeta.mimeType,
      });

      setAvatarFile(nextAvatarFile);

      if (avatarPreviewUrlRef.current) {
        URL.revokeObjectURL(avatarPreviewUrlRef.current);
      }

      const previewUrl = URL.createObjectURL(nextAvatarFile);
      avatarPreviewUrlRef.current = previewUrl;
      setAvatarPreview(previewUrl);
      closeCropDialog();
    } catch (error) {
      console.error("Failed to crop avatar:", error);
      toast.error(t("toasts.uploadFailed"));
      setIsApplyingCrop(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      let nextImageUrl: string | undefined;
      const nextEmail = String(formData.get("email") ?? "").trim();
      const nextNickname = String(formData.get("nickname") ?? "").trim() || null;
      const nextFirstName = String(formData.get("firstName") ?? "").trim() || null;
      const nextLastName = String(formData.get("lastName") ?? "").trim() || null;

      if (avatarFile) {
        try {
          nextImageUrl = await uploadImage(avatarFile, "avatars");
        } catch (error) {
          console.error("Failed to upload avatar:", error);
          toast.error(t("toasts.uploadFailed"));
          return;
        }
      }

      const result = await updateProfileAction({
        email: nextEmail,
        nickname: nextNickname ?? "",
        firstName: nextFirstName ?? "",
        lastName: nextLastName ?? "",
        image: nextImageUrl,
      });

      if (!result.ok) {
        toast.error(result.message ?? t("toasts.updateFailed"));
        return;
      }

      const nextName = [nextFirstName, nextLastName].filter(Boolean).join(" ").trim() || nextNickname || null;
      await updateSession({
        user: {
          email: nextEmail,
          image: nextImageUrl ?? initialProfile.image,
          name: nextName,
          nickname: nextNickname,
          firstName: nextFirstName,
          lastName: nextLastName,
        },
      });

      if (nextImageUrl && avatarPreviewUrlRef.current) {
        URL.revokeObjectURL(avatarPreviewUrlRef.current);
        avatarPreviewUrlRef.current = null;
      }

      setAvatarPreview(nextImageUrl ?? initialProfile.image);
      setAvatarFile(null);
      toast.success(t("toasts.updateSuccess"));
      router.refresh();
    });
  };

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{t("profile.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("profile.description")}</p>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 rounded-xl border bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-accent">
              {avatarPreview ? (
                <Image src={avatarPreview} alt={t("profile.avatarAlt")} fill className="object-cover" />
              ) : (
                <span className="text-sm font-semibold">{getAvatarFallback(initialProfile)}</span>
              )}
            </div>
            <div>
              <p className="font-medium">{t("profile.avatarTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("profile.avatarHint")}</p>
            </div>
          </div>

          <div>
            <Label htmlFor="avatar" className="sr-only">
              {t("profile.fields.avatar")}
            </Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              className="w-full sm:w-72"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="nickname">{t("profile.fields.nickname")}</Label>
            <Input id="nickname" name="nickname" defaultValue={initialProfile.nickname} />
          </div>
          <div>
            <Label htmlFor="email">{t("profile.fields.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={initialProfile.email}
              required
            />
          </div>
          <div>
            <Label htmlFor="firstName">{t("profile.fields.firstName")}</Label>
            <Input id="firstName" name="firstName" defaultValue={initialProfile.firstName} />
          </div>
          <div>
            <Label htmlFor="lastName">{t("profile.fields.lastName")}</Label>
            <Input id="lastName" name="lastName" defaultValue={initialProfile.lastName} />
          </div>
        </div>

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? (
            <>
              <Save className="size-4 animate-pulse" />
              {t("profile.saving")}
            </>
          ) : (
            <>
              <Save className="size-4" />
              {t("profile.save")}
            </>
          )}
        </Button>
      </form>

      <Dialog
        open={isCropDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeCropDialog();
            return;
          }

          setIsCropDialogOpen(true);
        }}
      >
        <DialogContent className="max-w-[560px] gap-0 p-0" showCloseButton={!isApplyingCrop}>
          <DialogHeader className="space-y-1 px-5 pt-5">
            <DialogTitle>{t("profile.cropper.title")}</DialogTitle>
            <DialogDescription>{t("profile.cropper.description")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-5 pb-5 pt-4">
            <div className="relative h-72 overflow-hidden rounded-xl bg-accent/50">
              {cropSource ? (
                <Cropper
                  image={cropSource}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  minZoom={1}
                  maxZoom={3}
                  objectFit="cover"
                  onCropChange={setCrop}
                  onCropComplete={handleCropComplete}
                  onZoomChange={setZoom}
                />
              ) : null}
            </div>

            <div className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2">
              <Label htmlFor="avatar-zoom" className="sr-only">
                {t("profile.cropper.zoom")}
              </Label>
              <ZoomOut className="size-4 text-muted-foreground" />
              <input
                id="avatar-zoom"
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-full accent-primary"
              />
              <ZoomIn className="size-4 text-muted-foreground" />
            </div>

            <DialogFooter className="flex-row justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeCropDialog} disabled={isApplyingCrop}>
                {t("profile.cropper.cancel")}
              </Button>
              <Button
                type="button"
                onClick={handleApplyCrop}
                disabled={!cropSource || !croppedAreaPixels || isApplyingCrop}
              >
                {isApplyingCrop ? t("profile.saving") : t("profile.cropper.apply")}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
