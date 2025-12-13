import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const tasks = await prisma.task.findMany({
        where: { userId, status: "Completed",
            date: { lte: new Date() }
        },
        orderBy: { date: "desc" },
    });
    return NextResponse.json(tasks);
}