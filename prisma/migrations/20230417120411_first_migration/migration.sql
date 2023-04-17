/*
  Warnings:

  - Changed the type of `bornDate` on the `usuarios` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "bornDate",
ADD COLUMN     "bornDate" TIMESTAMP(3) NOT NULL;
