/*
  Warnings:

  - You are about to drop the column `deadline` on the `Task` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "deadline",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "priority" SET DEFAULT 'Low',
ALTER COLUMN "status" SET DEFAULT 'Not Started';

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
