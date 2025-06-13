/*
  Warnings:

  - A unique constraint covering the columns `[inviteToken]` on the table `Proyecto` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Proyecto" ADD COLUMN     "inviteToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Proyecto_inviteToken_key" ON "Proyecto"("inviteToken");
