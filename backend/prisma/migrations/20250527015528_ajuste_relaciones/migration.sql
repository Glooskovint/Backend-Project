/*
  Warnings:

  - Added the required column `fecha_fin` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_inicio` to the `Proyecto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Proyecto" DROP CONSTRAINT "Proyecto_ownerId_fkey";

-- AlterTable
ALTER TABLE "Proyecto" ADD COLUMN     "fecha_fin" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fecha_inicio" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "descripcion" DROP NOT NULL,
ALTER COLUMN "objetivo_general" DROP NOT NULL,
ALTER COLUMN "ownerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Proyecto" ADD CONSTRAINT "Proyecto_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Usuario"("firebase_uid") ON DELETE SET NULL ON UPDATE CASCADE;
