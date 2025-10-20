import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const task = await prisma.task.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: {
      title: body.title,
      description: body.description,
      date: body.date,
      priority: body.priority,
      status: body.status,
    },
  })

  return NextResponse.json(task)
}
