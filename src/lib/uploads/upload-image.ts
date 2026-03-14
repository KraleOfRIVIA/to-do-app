export type UploadScope = "tasks" | "avatars";

export async function uploadImage(file: File, scope: UploadScope = "tasks"): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("scope", scope)

  const response = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const message = payload?.error ?? "Failed to upload image"
    throw new Error(message)
  }

  const payload = (await response.json()) as { url: string }
  return payload.url
}
