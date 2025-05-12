/*
  Warnings:

  - You are about to drop the column `checkIn` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `checkOut` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `end` on the `Overtime` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `Overtime` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Overtime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `Overtime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Overtime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "checkIn",
DROP COLUMN "checkOut",
ADD COLUMN     "clockIn" TIMESTAMP(3),
ADD COLUMN     "clockOut" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isLate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Overtime" DROP COLUMN "end",
DROP COLUMN "start",
ADD COLUMN     "approverId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "reason" TEXT NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_date_key" ON "Attendance"("userId", "date");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_date_fkey" FOREIGN KEY ("userId", "date") REFERENCES "ShiftMapping"("userId", "date") ON DELETE RESTRICT ON UPDATE CASCADE;
