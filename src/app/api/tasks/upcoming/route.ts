import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 1. Дата сегодня
  const now = new Date()
  // 2. Через 1 день
  const weekLater = new Date()
  weekLater.setDate(now.getDate() + 5)

  // 3. Фильтр по диапазону дат
  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: now,       // дедлайн >= сегодня
        lte: weekLater, // дедлайн <= через 7 дней
      },
      NOT: {
        status: "Completed", // исключаем завершенные задачи
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  return NextResponse.json(tasks)
}