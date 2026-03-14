import { randomUUID } from "node:crypto"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
])

export const runtime = "nodejs"

function resolveScope(rawScope: FormDataEntryValue | null): "tasks" | "avatars" {
  if (rawScope === "avatars") {
    return "avatars"
  }

  return "tasks"
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_").toLowerCase()
}

function getFileExtension(file: File) {
  const extFromName = path.extname(file.name).toLowerCase()
  if (extFromName) return extFromName

  if (file.type === "image/jpeg") return ".jpg"
  if (file.type === "image/png") return ".png"
  if (file.type === "image/webp") return ".webp"
  if (file.type === "image/gif") return ".gif"
  if (file.type === "image/avif") return ".avif"
  return ".bin"
}

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file")
  const scope = resolveScope(formData.get("scope"))

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "File is too large. Max size is 5MB" }, { status: 400 })
  }

  if (file.type && !ALLOWED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
  }

  const safeFileName = sanitizeFileName(file.name)
  const extension = getFileExtension(file)
  const uploadDir = path.join(process.cwd(), "public", "uploads", scope)
  const fileName = `${Date.now()}-${randomUUID()}-${safeFileName || `image${extension}`}`
  const fullPath = path.join(uploadDir, fileName)

  await mkdir(uploadDir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(fullPath, buffer)

  return NextResponse.json({ url: `/uploads/${scope}/${fileName}` }, { status: 201 })
}
