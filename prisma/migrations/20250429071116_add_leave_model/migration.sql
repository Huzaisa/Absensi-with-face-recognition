/*
  Warnings:

  - You are about to drop the column `approved` on the `Leave` table. All the data in the column will be lost.
  - You are about to drop the column `document` on the `Leave` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Leave" DROP COLUMN "approved",
DROP COLUMN "document",
ADD COLUMN     "approverId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING';
