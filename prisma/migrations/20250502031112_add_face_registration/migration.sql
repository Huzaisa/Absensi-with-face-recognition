-- CreateTable
CREATE TABLE "FaceRegistration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FaceRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FaceRegistration_userId_key" ON "FaceRegistration"("userId");

-- AddForeignKey
ALTER TABLE "FaceRegistration" ADD CONSTRAINT "FaceRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
