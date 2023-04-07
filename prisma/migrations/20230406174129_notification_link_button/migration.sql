-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "buttonUrl" TEXT,
ADD COLUMN     "dismissable" BOOLEAN NOT NULL DEFAULT true;
