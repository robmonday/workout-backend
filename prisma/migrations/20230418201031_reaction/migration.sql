-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emojiSymbol" TEXT NOT NULL,
    "seed" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_workoutId_userId_key" ON "Reaction"("workoutId", "userId");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
