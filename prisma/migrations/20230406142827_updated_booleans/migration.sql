/*
  Warnings:

  - You are about to drop the column `dismissed` on the `Notifications` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Notifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notifications" DROP COLUMN "dismissed",
DROP COLUMN "read",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "open" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "unread" BOOLEAN NOT NULL DEFAULT true;
