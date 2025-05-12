/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `isLate` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Leave` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Leave` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Leave` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Overtime` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Overtime` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Overtime` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Overtime` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Shift` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end` to the `Overtime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Overtime` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EMPLOYEE');

-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_userId_fkey";

-- DropIndex
DROP INDEX "Attendance_userId_date_key";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "createdAt",
DROP COLUMN "isLate",
DROP COLUMN "updatedAt",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Leave" DROP COLUMN "createdAt",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "document" TEXT;

-- AlterTable
ALTER TABLE "Overtime" DROP COLUMN "createdAt",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "updatedAt",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "password",
DROP COLUMN "updatedAt",
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'EMPLOYEE';

-- DropTable
DROP TABLE "Shift";

-- CreateTable
CREATE TABLE "ShiftMapping" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShiftMapping_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShiftMapping" ADD CONSTRAINT "ShiftMapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
