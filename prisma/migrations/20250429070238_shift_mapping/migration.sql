/*
  Warnings:

  - You are about to drop the column `end` on the `ShiftMapping` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `ShiftMapping` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,date]` on the table `ShiftMapping` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shiftId` to the `ShiftMapping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShiftMapping" DROP COLUMN "end",
DROP COLUMN "start",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "shiftId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShiftMapping_userId_date_key" ON "ShiftMapping"("userId", "date");

-- AddForeignKey
ALTER TABLE "ShiftMapping" ADD CONSTRAINT "ShiftMapping_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
