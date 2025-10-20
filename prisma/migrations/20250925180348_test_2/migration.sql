-- DropIndex
DROP INDEX "public"."Task_userId_idx";

-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ALTER COLUMN "priority" DROP DEFAULT;
