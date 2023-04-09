-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "DOB" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "inches" INTEGER,
ADD COLUMN     "lbs" INTEGER;
